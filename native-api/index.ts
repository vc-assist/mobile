import { Browser } from "@capacitor/browser"
import { Capacitor } from "@capacitor/core"
import { Device } from "@capacitor/device"
import { InAppBrowser } from "@capgo/inappbrowser"
import { EmailComposer } from "capacitor-email-composer"
import { SafeArea } from "capacitor-plugin-safe-area"
import type { NativeAPI } from "../frontend/lib/native"
import { type SafeArea as Insets } from '../frontend/ui'

export default class CapacitorAPI implements NativeAPI {
  launchUrl(url: string): Promise<void> {
    if (!url.startsWith("mailto:")) {
      return Browser.open({ url })
    }
    const parsed = new URL(url)
    return EmailComposer.open({
      to: [parsed.pathname],
      cc: parsed.searchParams.getAll("cc"),
      bcc: parsed.searchParams.getAll("bcc"),
      subject: parsed.searchParams.get("subject") ?? undefined,
      body: parsed.searchParams.get("body") ?? undefined,
      isHtml: true,
    })
  }

  async userAgent(): Promise<string> {
    const info = await Device.getInfo()
    let userAgent = ""
    switch (Capacitor.getPlatform()) {
      case "ios":
        userAgent = `Mozilla/5.0 (iPhone; CPU iPhone OS ${info.osVersion
          } like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${info.osVersion.split(".")[0] ?? 13
          } Mobile/15E148 Safari/604.1`
        break
    }
    return userAgent
  }

  async openWebview(url: string, userAgent?: string): Promise<void> {
    await InAppBrowser.open({
      url,
      headers: userAgent ? { "User-Agent": userAgent } : undefined,
    })
  }

  async closeWebview(): Promise<void> {
    await InAppBrowser.close()
  }

  async onWebviewNavigate(
    fn: (url: string) => void,
  ): Promise<() => Promise<void>> {
    const handle = await InAppBrowser.addListener("urlChangeEvent", (state) => {
      fn(state.url)
    })
    return () => handle.remove()
  }

  async onWebviewClosed(fn: () => void): Promise<() => Promise<void>> {
    const handle = await InAppBrowser.addListener("closeEvent", () => fn())
    return () => handle.remove()
  }

  async safeArea(): Promise<Insets> {
    const { insets } = await SafeArea.getSafeAreaInsets()
    return insets
  }
}
