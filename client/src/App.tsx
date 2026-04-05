import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "@/pages/Dashboard";
import PropertyDetail from "@/pages/PropertyDetail";
import NotFound from "@/pages/not-found";

export default function App() {
  return (
    <>
      <Router hook={useHashLocation}>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/q/:quarter" component={Dashboard} />
          <Route path="/property/:id" component={PropertyDetail} />
          <Route path="/property/:id/:quarter" component={PropertyDetail} />
          <Route component={NotFound} />
        </Switch>
      </Router>
      <Toaster />
    </>
  );
}
