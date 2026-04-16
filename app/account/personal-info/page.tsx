import { redirect } from "next/navigation";
import { updateProfile } from "@/app/actions";
import { getMyProfile } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";

export default async function PersonalInfoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const profile = await getMyProfile();

  return (
    <main className="tf-container flex-1 py-10">
      <Card className="premium-card mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl">Personal information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={updateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user.email ?? ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>Full name</Label>
              <Input name="full_name" defaultValue={profile?.full_name ?? ""} placeholder="Enter full name" />
            </div>
            <SubmitButton pendingLabel="Saving..." className="bg-[#d84e55] hover:bg-[#c63f46]">
              Save changes
            </SubmitButton>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
