import * as React from "react"
import { ToastAction } from "./toast-action"
import { Toast } from "./toast"

export type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>
export type ToastActionElement = React.ReactElement<typeof ToastAction> 