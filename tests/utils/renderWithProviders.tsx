import { render } from "@testing-library/react";
import type { RenderOptions, RenderResult } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";

interface ProvidersConfig {
  children: ReactNode;
}

function Providers({ children }: ProvidersConfig) {
  return <>{children}</>;
}

export function renderWithProviders(
  ui: ReactElement,
  options?: RenderOptions
): RenderResult {
  return render(ui, { wrapper: Providers, ...options });
}
