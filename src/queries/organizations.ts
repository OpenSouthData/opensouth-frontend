import { UseQueryOptions, useQuery } from "@tanstack/react-query";

export function useUserOrganizations(options?: UseQueryOptions<Organization[]>) {
  return useQuery<Organization[]>([`/user/organisations/`], options);
}

export function useUserOrganizationDetails(slug: string, options?: UseQueryOptions<Organization>) {
  return useQuery<Organization>([`/organisations/${slug}/`], options);
}

export function useAdminOrganizations(
  search = "",
  filterBy: {
    status: string | null;
    isVerified: string | null;
    isActive: string | null;
  } = {
    status: null,
    isActive: null,
    isVerified: null,
  },
  pagination: { pageSize: number; page: number },
  options?: UseQueryOptions<PaginatedResponse<Organization[]>>
) {
  const { status, isVerified, isActive } = filterBy;
  const { page, pageSize } = pagination;
  const newStatus = status === "approve" ? "approved" : status === "reject" ? "rejected" : status;

  return useQuery<PaginatedResponse<Organization[]>>(
    [
      `/admin/organisations/?search=${search}&status=${newStatus || ""}&verified=${isVerified || ""}&active=${isActive || ""}&limit=${pageSize}&offset=${page * pageSize}`,
    ],
    options
  );
}

export function useAdminOrganizationDetails(id: string, options?: UseQueryOptions<Organization>) {
  return useQuery<Organization>([`/admin/organisations/${id}/`], options);
}

export function useAdminOrganizationUsers(
  id: string,
  pageSize: number = 10,
  page: number = 1,
  options?: UseQueryOptions<PaginatedResponse<CurrentUser[]>>
) {
  return useQuery<PaginatedResponse<CurrentUser[]>>(
    [`/organisations/users/${id}/?limit=${pageSize}&offset=${(page - 1) * pageSize}`],
    options
  );
}

export function useAdminOrganizationRequests(
  id: string,
  options?: UseQueryOptions<OrganizationRequest[]>
) {
  return useQuery<OrganizationRequest[]>([`/admin/organisation_requests/?pk=${id}`], options);
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
  search = "",
  sortBy: "" | "most-datasets" | "most-recent" = "",
  pagination: { pageSize: number; page: number } = { pageSize: 20, page: 1 }
) {
  const { pageSize, page } = pagination;

  return useQuery<PaginatedResponse<Organization[]>>([
    `/public/organisations/?key=public&search=${search}&sortBy=${sortBy}&limit=${pageSize}&offset=${(page - 1) * pageSize}`,
  ]);
}

export function usePublicOrganizationDetails(
  slug: string,
  options?: UseQueryOptions<Organization>
) {
  return useQuery<Organization>([`/public/organisations/${slug}/?key=public`], options);
}
