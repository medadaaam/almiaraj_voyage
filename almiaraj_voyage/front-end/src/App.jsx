import { RouterProvider } from "react-router-dom";
import { route } from "./router";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
    return(
        <AuthProvider>
            <RouterProvider router={route} />
        </AuthProvider>

    )
}
