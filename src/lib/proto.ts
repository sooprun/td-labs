import { toast } from "sonner"

export function protoAction(_label: string) {
  return () => toast.info("This doesn't work in the prototype — try something else")
}
