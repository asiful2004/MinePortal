import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";
import { useLanguage } from "./hooks/use-language";

// Pages
import Home from "@/pages/home";
import News from "@/pages/news";
import Vote from "@/pages/vote";
import Season from "@/pages/season";
import About from "@/pages/about";
import Store from "@/pages/store";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import NotFound from "@/pages/not-found";

// Layout components
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import LanguageSwitcher from "@/components/ui/language-switcher";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-16">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/news" component={News} />
          <Route path="/vote" component={Vote} />
          <Route path="/season" component={Season} />
          <Route path="/about" component={About} />
          <Route path="/store" component={Store} />
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <LanguageSwitcher />
    </div>
  );
}

function App() {
  // Initialize language
  useLanguage();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
