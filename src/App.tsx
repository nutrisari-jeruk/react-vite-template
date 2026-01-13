import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryProvider } from "./lib/QueryProvider";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Components from "./pages/Components";
import ErrorExamples from "./pages/ErrorExamples";
import AuthExample from "./pages/AuthExample";
import FormValidationExample from "./pages/FormValidationExample";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="components" element={<Components />} />
            <Route path="error-examples" element={<ErrorExamples />} />
            <Route path="auth-example" element={<AuthExample />} />
            <Route path="form-validation" element={<FormValidationExample />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;
