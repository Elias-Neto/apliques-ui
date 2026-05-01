import { useQuery } from "@tanstack/react-query"
import { fetchPermissionGroups } from "../services/permission-groups"

export const useFetchPermissionGroups = () =>
  useQuery({ queryKey: ["permission-groups"], queryFn: fetchPermissionGroups })
