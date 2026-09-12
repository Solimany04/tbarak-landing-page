'use client';

/**
 * Admin UI for the `compressedImage` field. Loaded lazily by
 * ./compressed-image.tsx so that @keystar/ui and the canvas code never reach
 * the server bundles (see the note there). Layout, labels and buttons follow
 * Keystatic's built-in ImageFieldInput so the field looks native.
 */
import { ActionButton, ButtonGroup } from '@keystar/ui/button';
import { FieldDescription, FieldLabel, FieldMessage } from '@keystar/ui/field';
import { Box, Flex } from '@keystar/ui/layout';
import { ProgressCircle } from '@keystar/ui/progress';
import { tokenSchema } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { useEffect, useId, useReducer, useState } from 'react';
import type { CompressedImageInputProps, CompressedImageValue } from './compressed-image';
import { compressImage, formatBytes } from './image-compression';

/** Open the native file picker. Resolves `undefined` when the user cancels. */
function pickImage(): Promise<File | undefined> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    const done = (file?: File) => {
      input.remove();
      resolve(file);
    };
    input.onchange = () => done(input.files?.[0]);
    input.oncancel = () => done();
    document.body.appendChild(input);
    input.click();
  });
}

/**
 * Object URL for the current bytes. Created inside the effect (not memoised)
 * so that a remount — StrictMode does one in dev — recreates the URL its own
 * cleanup revoked. Same shape as Keystatic's internal useObjectURL.
 */
function useObjectURL(data: Uint8Array | null, contentType?: string) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    const next = data ? URL.createObjectURL(new Blob([data as BlobPart], { type: contentType })) : null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing an external resource whose lifetime is this effect's
    setUrl(next);
    return () => {
      if (next) URL.revokeObjectURL(next);
    };
  }, [data, contentType]);
  return url;
}

const dims = (w?: number, h?: number) => (w && h ? `${w} × ${h}` : null);

function Summary({
  value,
  loadedSize,
  maxBytes,
}: {
  value: CompressedImageValue;
  loadedSize: { w: number; h: number } | null;
  maxBytes: number;
}) {
  const bytes = value.data.byteLength;
  const { meta } = value;

  // Already-committed image (or a restored draft): nothing was compressed in
  // this session, so report what is on disk and nudge if it is oversized.
  if (!meta) {
    return (
      <>
        <Text size="small" color="neutralSecondary">
          {[formatBytes(bytes), dims(loadedSize?.w, loadedSize?.h)].filter(Boolean).join(' · ')}
        </Text>
        {bytes > maxBytes && (
          <Text size="small" color="caution">
            Over the {formatBytes(maxBytes)} limit — choose the file again to compress it.
          </Text>
        )}
      </>
    );
  }

  const after = [formatBytes(bytes), dims(meta.width, meta.height)].filter(Boolean).join(', ');
  const before = [formatBytes(meta.originalBytes), dims(meta.originalWidth, meta.originalHeight)]
    .filter(Boolean)
    .join(', ');
  const saved = meta.originalBytes > 0 ? Math.round((1 - bytes / meta.originalBytes) * 100) : 0;

  if (meta.outcome === 'original') {
    return (
      <Text size="small" color="neutralSecondary">
        Kept the original ({after}) — it was already smaller than the compressed version.
      </Text>
    );
  }
  return (
    <>
      <Text size="small" color="neutralSecondary">
        Original {before} → {after} ({saved}% smaller)
        {meta.outcome === 'webp' ? ' · WebP' : ` · ${value.extension.toUpperCase()}`}
      </Text>
      {meta.outcome === 'fallback' && (
        <Text size="small" color="caution">
          This browser can&apos;t encode WebP, so the image was kept in its original format.
        </Text>
      )}
    </>
  );
}

export default function CompressedImageInput(props: CompressedImageInputProps) {
  const { value, onChange, label, description, isRequired, forceValidation, maxEdge, quality, maxBytes } = props;
  const [blurred, onBlur] = useReducer(() => true, false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedSize, setLoadedSize] = useState<{ w: number; h: number } | null>(null);
  const objectUrl = useObjectURL(value?.data ?? null, value?.extension === 'svg' ? 'image/svg+xml' : undefined);
  const labelId = useId();
  const descriptionId = useId();

  const chooseFile = async () => {
    const file = await pickImage();
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const result = await compressImage(file, { maxEdge, quality });
      if (result.blob.size > maxBytes) {
        setError(
          `Still ${formatBytes(result.blob.size)} after compression — the limit is ${formatBytes(maxBytes)}. ` +
            'Try a smaller or less detailed image.'
        );
        return;
      }
      const base = file.name.replace(/\.[^.]+$/, '') || 'image';
      onChange({
        data: new Uint8Array(await result.blob.arrayBuffer()),
        extension: result.extension,
        filename: `${base}.${result.extension}`,
        meta: {
          originalBytes: file.size,
          originalName: file.name,
          width: result.width,
          height: result.height,
          originalWidth: result.originalWidth,
          originalHeight: result.originalHeight,
          resized: result.resized,
          outcome: result.outcome,
        },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not process this image.');
    } finally {
      setBusy(false);
    }
  };

  const showRequired = (forceValidation || blurred) && isRequired && value === null;
  // Mirrors validate(): unreachable through the picker, but shown if Keystatic
  // ever forces validation on an oversized fresh upload.
  const showTooBig = forceValidation && !!value?.meta && value.data.byteLength > maxBytes;

  return (
    <Flex
      direction="column"
      gap="medium"
      role="group"
      aria-labelledby={labelId}
      aria-describedby={description ? descriptionId : undefined}
    >
      <FieldLabel id={labelId} elementType="span" isRequired={isRequired}>
        {label}
      </FieldLabel>
      {description && <FieldDescription id={descriptionId}>{description}</FieldDescription>}
      <ButtonGroup>
        <ActionButton onPress={chooseFile} isDisabled={busy}>
          {busy ? 'Compressing…' : 'Choose file'}
        </ActionButton>
        {busy && <ProgressCircle size="small" isIndeterminate aria-label="Compressing image" />}
        {value !== null && !busy && (
          <ActionButton
            prominence="low"
            onPress={() => {
              onChange(null);
              onBlur();
            }}
          >
            Remove
          </ActionButton>
        )}
      </ButtonGroup>
      {objectUrl && (
        <Box alignSelf="start" backgroundColor="canvas" borderRadius="regular" border="neutral" padding="regular">
          {/* eslint-disable-next-line @next/next/no-img-element -- in-memory blob: URL preview, not optimisable */}
          <img
            src={objectUrl}
            alt=""
            onLoad={(e) => setLoadedSize({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
            style={{ display: 'block', maxHeight: tokenSchema.size.alias.singleLineWidth, maxWidth: '100%' }}
          />
        </Box>
      )}
      {value && <Summary value={value} loadedSize={loadedSize} maxBytes={maxBytes} />}
      {error && <FieldMessage>{error}</FieldMessage>}
      {showRequired && <FieldMessage>{label} is required</FieldMessage>}
      {showTooBig && (
        <FieldMessage>
          {label} must be {formatBytes(maxBytes)} or smaller after compression
        </FieldMessage>
      )}
    </Flex>
  );
}
