import { toast } from "sonner"

export function protoAction(_label: string) {
  return () => toast.info("Not available in this prototype")
}
