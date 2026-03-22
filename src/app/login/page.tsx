import { PageLayout } from "@/components/ui/page-layout";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {

  return (
    <PageLayout>
      <AuthForm mode="login" />
    </PageLayout>
  );
}

