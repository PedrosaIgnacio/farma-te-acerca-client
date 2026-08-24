import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "@/context/AuthContext";
import { RequestsProvider } from "@/context/RequestsContext";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import { DTPage } from "@/pages/DTPage";
import { HcNewRequestPage } from "@/pages/HcNewRequestPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { LoginPage } from "@/pages/LoginPage";
import { NewRequestPage } from "@/pages/NewRequestPage";
import { RequestDetailPage } from "@/pages/RequestDetailPage";
import { SolicitudesPage } from "@/pages/SolicitudesPage";
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
                <Route path="solicitudes/:id" element={<RequestDetailPage />} />
              </Route>
            </Route>

            <Route element={<RequireRole allow={["hc"]} />}>
              <Route path="/capital-humano" element={<Navigate to="/capital-humano/solicitudes" replace />} />
              <Route path="/capital-humano/solicitudes" element={<SolicitudesPage />} />
              <Route path="/capital-humano/solicitudes/nueva" element={<HcNewRequestPage />} />
              <Route path="/capital-humano/analytics" element={<AnalyticsPage />} />
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
