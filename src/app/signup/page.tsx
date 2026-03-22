import { PageLayout } from "@/components/ui/page-layout";
import { AuthForm } from "@/components/auth-form";

export default function SignupPage() {
  return (
    <PageLayout>
      <AuthForm mode="signup" />
    </PageLayout>
  );
}
