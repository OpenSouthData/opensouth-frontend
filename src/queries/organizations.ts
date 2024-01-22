import { UseQueryOptions, useQuery } from "@tanstack/react-query";

export function useUserOrganizations() {
  return useQuery<Organization[]>([`/user/organisations/`]);
}

export function useUserOrganizationDetails(slug: string, options?: UseQueryOptions<Organization>) {
  return useQuery<Organization>([`/organisations/${slug}/`], options);
}

export function useAdminOrganizations(
  pageSize: number = 10,
  page: number = 1,
  options?: UseQueryOptions<PaginationData<Organization[]>>
) {
  return useQuery<PaginationData<Organization[]>>(
    [`/admin/organisations/?limit=${pageSize}&offset=${(page - 1) * pageSize}`],
    options
  );
}

export function useAdminOrganizationUsers(
  id: string,
  pageSize: number = 10,
  page: number = 1,
  options?: UseQueryOptions<PaginationData<CurrentUser[]>>
) {
  return useQuery<PaginationData<CurrentUser[]>>(
    [`/admin/organisations/${id}/users/?limit=${pageSize}&offset=${(page - 1) * pageSize}`],
    options
  );
}

export function useAdminOrganizationRequests(id: string) {
  return useQuery<Organization[]>([`/admin/organisations/${id}/requests`]);
}

export function useAdminOrganizationsIndicators() {
  return useQuery<{
    count: number;
    approved: number;
    rejected: number;
    pending: number;
  }>([`/admin/organisations/indicators/`]);
}

export function usePublicOrganizations(
  pageSize: number = 10,
  page: number = 1,
  options?: UseQueryOptions<PaginationData<Organization[]>>
) {
  return useQuery<PaginationData<Organization[]>>(
    [`/public/organisations/?key=public&limit=${pageSize}&offset=${(page - 1) * pageSize}`],
    options
  );
}

export function usePublicOrganizationDetails(
  slug: string,
  options?: UseQueryOptions<Organization>
) {
  return useQuery<Organization>([`/public/organisations/${slug}/?key=public`], options);
}
