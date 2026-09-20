import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/class/$classId/$subject")({
  component: () => <Outlet />,
});
