import { Browser } from "@capacitor/browser"
import { Capacitor } from "@capacitor/core"
import { Device } from "@capacitor/device"
import { InAppBrowser } from "@capgo/inappbrowser"
import { SafeArea } from "capacitor-plugin-safe-area"
import type { NativeAPI } from "../frontend/lib/native"
import { type SafeArea as Insets } from '../frontend/ui'

class CapacitorAPI implements NativeAPI {
  launchUrl(url: string): Promise<void> {
    if (url.startsWith("mailto:")) {
      throw new Error("mailto: links do not work on mobile at the moment.")
    }
    return Browser.open({ url })
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

  async onSafeAreaChange(fn: (safeArea: Insets) => void): Promise<() => Promise<void>> {
    const { insets } = await SafeArea.getSafeAreaInsets()
    fn(insets)

    const handle = await SafeArea.addListener("safeAreaChanged", ({ insets }) => {
      fn(insets)
    })

    return () => handle.remove()
  }
}

export default new CapacitorAPI()
