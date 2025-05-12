
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Logo from "@/assets/logo";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-4 bg-accent/50">
      <div className="container max-w-4xl py-8 mx-auto">
        <div className="mb-8 text-center">
          <Logo className="mx-auto mb-6" />
          <h1 className="text-3xl font-bold">Terms & Conditions</h1>
          <p className="text-muted-foreground">Last updated: May 7, 2025</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              By downloading, installing, or using the 24h App, you agree to be bound 
              by these Terms & Conditions. If you do not agree to these terms, 
              please do not use the application.
            </p>
            <p>
              The 24h App provides a platform connecting patients with qualified 
              nurses for home healthcare services. We do not provide medical services 
              directly but facilitate connections between users and healthcare providers.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>2. User Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              You must register for an account to use our services. You agree to provide 
              accurate, current, and complete information during registration and to 
              update such information to keep it accurate, current, and complete.
            </p>
            <p>
              For nurse accounts, you must provide valid professional credentials which 
              will be verified before your account is activated. You are responsible for 
              maintaining the confidentiality of your account credentials.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>3. Service Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The 24h App connects patients with registered nurses for in-home healthcare 
              services. Patients can request nursing services, and nurses can accept these 
              requests based on their availability and qualifications.
            </p>
            <p>
              We do not guarantee the quality, safety, or legality of services provided 
              by nurses on our platform. We do, however, require nurses to maintain 
              professional standards and valid credentials.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>4. Payment Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Payment for services is negotiated between patients and nurses directly 
              through our platform. We may charge service fees for facilitating these 
              connections, which will be clearly displayed before any transaction.
            </p>
            <p>
              All payments must be made through approved payment methods within the app. 
              Cash payments are made directly to nurses at your own risk.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>5. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              To the maximum extent permitted by law, the 24h App, its owners, employees, 
              and affiliates shall not be liable for any indirect, incidental, special, 
              consequential, or punitive damages resulting from your use or inability to 
              use the service.
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-center mt-8">
          <Button onClick={() => navigate(-1)} className="px-8">
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Terms;
