import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CreditCard,
  Calendar,
  Download,
  Check,
  Star,
  ArrowUpRight,
  Crown,
  Sparkles,
  DollarSign,
  Clock,
} from "lucide-react";
import { useAccount } from "../hooks/useAccount";
import { BillingPlan } from "../types/accountTypes";

const plans: BillingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    currency: "USD",
    interval: "monthly",
    features: [
      "Access to 10 basic courses",
      "Community forum access",
      "Mobile app access",
      "Basic progress tracking",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 29.99,
    currency: "USD",
    interval: "monthly",
    isPopular: true,
    features: [
      "Unlimited course access",
      "Premium courses & workshops",
      "Advanced analytics",
      "Priority support",
      "Offline downloads",
      "Custom learning paths",
      "Certificates & badges",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99.99,
    currency: "USD",
    interval: "monthly",
    features: [
      "Everything in Pro",
      "Team management tools",
      "Advanced reporting",
      "SSO integration",
      "Custom branding",
      "Dedicated account manager",
      "API access",
    ],
  },
];

export function BillingPage() {
  const { subscription, paymentHistory } = useAccount();

  const currentPlan =
    plans.find((p) => p.id === subscription?.plan) || plans[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800";
      case "failed":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case "pro":
        return <Crown className="h-4 w-4" />;
      case "enterprise":
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const handleUpgrade = () => {
    window.open("https://bolt.new/setup/stripe", "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Current Subscription</span>
          </CardTitle>
          <CardDescription>
            Manage your subscription and billing information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-muted rounded-lg">
                {getPlanIcon(currentPlan.id)}
              </div>
              <div>
                <h3 className="font-semibold">{currentPlan.name} Plan</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold">
                    ${currentPlan.price}
                  </span>
                  <span className="text-muted-foreground">
                    /{currentPlan.interval}
                  </span>
                </div>
              </div>
            </div>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
            >
              {subscription?.status?.toUpperCase() || "ACTIVE"}
            </Badge>
          </div>

          {subscription && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Next Billing</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(
                      subscription.currentPeriodEnd
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Auto-Renewal</p>
                  <p className="text-sm text-muted-foreground">
                    {subscription.cancelAtPeriodEnd ? "Disabled" : "Enabled"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <Button>
              <CreditCard className="h-4 w-4 mr-2" />
              Manage Payment
            </Button>
            <Button variant="outline">
              {subscription?.cancelAtPeriodEnd ? "Reactivate" : "Cancel"}{" "}
              Subscription
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Available Plans</span>
          </CardTitle>
          <CardDescription>
            Choose the plan that best fits your needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className="relative">
                {plan.isPopular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <Card
                  className={`h-full ${currentPlan.id === plan.id ? "ring-2 ring-primary" : ""} ${plan.isPopular ? "border-primary" : ""}`}
                >
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="p-3 bg-muted rounded-lg w-fit mx-auto">
                        {getPlanIcon(plan.id)}
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          {plan.name}
                        </h3>
                        <div className="mb-4">
                          <span className="text-3xl font-bold">
                            ${plan.price}
                          </span>
                          <span className="text-muted-foreground">
                            /{plan.interval}
                          </span>
                        </div>
                      </div>

                      <ul className="space-y-2 text-left">
                        {plan.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-4">
                        {currentPlan.id === plan.id ? (
                          <Button disabled className="w-full">
                            Current Plan
                          </Button>
                        ) : (
                          <Button
                            onClick={handleUpgrade}
                            className="w-full"
                            variant={plan.isPopular ? "default" : "outline"}
                          >
                            {currentPlan.price < plan.price
                              ? "Upgrade"
                              : "Downgrade"}
                            <ArrowUpRight className="h-4 w-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Payment History</span>
          </CardTitle>
          <CardDescription>
            View your past payments and download invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paymentHistory.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No payment history</h3>
              <p className="text-muted-foreground">
                Your payment transactions will appear here
              </p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentHistory.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {new Date(payment.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell className="font-medium">
                        ${payment.amount.toFixed(2)} {payment.currency}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusColor(payment.status)}
                        >
                          {payment.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {payment.invoiceUrl && (
                          <Button variant="ghost" size="sm" asChild>
                            <a
                              href={payment.invoiceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Invoice
                            </a>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
