import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Form1() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 space-y-12">
      <div className="w-full max-w-md border rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-center">
          FieldSet outside FieldGroup
        </h2>
        {/* <form>
          <FieldSet>
            <FieldLegend>
              <FieldDescription>
                This information will appear on your profile
              </FieldDescription>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Full name</FieldLabel>
                  <Input id="name" placeholder="Enter your full name" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="bio">Bio</FieldLabel>
                  <Textarea id="bio" placeholder="Enter your bio" />
                </Field>
              </FieldGroup>
            </FieldLegend>
          </FieldSet>
          <Field orientation="vertical" className="mt-2">
            <Button type="button">
              Reset
            </Button>
            <Button type="submit">
              Submit
            </Button>
          </Field>
        </form> */}
        <form>
          <FieldSet>
            <FieldLegend>
              <FieldDescription>
                This information will appear on your profile
              </FieldDescription>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Full name</FieldLabel>
                  <Input id="name" placeholder="Enter your full name" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="bio">Bio</FieldLabel>
                  <Textarea id="bio" placeholder="Enter your bio" />
                </Field>
              </FieldGroup>
            </FieldLegend>
          </FieldSet>
          <Field className="mt-2">
            <Button variant="outline" type="submit">
              Submit
            </Button>
          </Field>
        </form>
      </div>
    </main>
  );
}
