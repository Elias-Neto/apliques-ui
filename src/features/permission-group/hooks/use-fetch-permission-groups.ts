import { useQuery } from "@tanstack/react-query"
import { fetchPermissionGroups } from "../permission-group.service"

export const useFetchPermissionGroups = () =>
  useQuery({ queryKey: ["permission-groups"], queryFn: fetchPermissionGroups })
