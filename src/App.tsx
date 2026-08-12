import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "@/context/AuthContext";
import { RequestsProvider } from "@/context/RequestsContext";
import { DTPage } from "@/pages/DTPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { HumanCapitalPage } from "@/pages/HumanCapitalPage";
import { LoginPage } from "@/pages/LoginPage";
import { NewRequestPage } from "@/pages/NewRequestPage";
import { RequireAuth, RequireRole, RootRedirect } from "@/routes/guards";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<RequireAuth />}>
            <Route index element={<RootRedirect />} />

            <Route element={<RequireRole allow={["collaborator"]} />}>
              <Route path="/colaborador" element={<RequestsProvider />}>
                <Route index element={<HistoryPage />} />
                <Route path="nueva" element={<NewRequestPage />} />
              </Route>
            </Route>

            <Route element={<RequireRole allow={["hc"]} />}>
              <Route path="/capital-humano" element={<HumanCapitalPage />} />
            </Route>

            <Route element={<RequireRole allow={["dt"]} />}>
              <Route path="/dt" element={<DTPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
