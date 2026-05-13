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
    <main className="flex flex-col items-center justify-center w-full">
      <div className="shadow-sm w-full">
        <form>
          <FieldSet>
            <FieldLegend className="w-full">
              <FieldGroup className="gap-3">
                <Field orientation="horizontal" className="">
                  <Input className="text-white font-normal" id="name" placeholder="الاسم الأول" />
                  <Input className="text-white font-normal" id="name" placeholder="الاسم الأخير" />
                </Field>
                <Field>
                  <Input className="text-white font-normal" id="name" placeholder="البريد الإلكتروني" />
                  <Input className="text-white font-normal" id="name" placeholder="رقم الهاتف" />
                  <Input className="text-white font-normal" id="name" placeholder="اكتب رسالتك" />
                </Field>
              </FieldGroup>
            </FieldLegend>
          </FieldSet>
          <Field className="mt-2">
            <Button className="bg-accent hover:bg-white hover:text-primary font-normal text-[15px]" type="submit">
              أرسل الآن
            </Button>
          </Field>
        </form>
      </div>
    </main>
  );
}
