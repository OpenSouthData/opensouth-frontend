import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { axiosPrivate } from "~/utils/api";
import { notifyError, notifySuccess } from "~/utils/toast";

function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation(
    async (
      data: Record<
        "name" | "description" | "email" | "type" | "linkedIn" | "twitter" | "website",
        string
      > & { logo: File }
    ) => {
      const { data: response } = await axiosPrivate.postForm(`/organisations/`, data);

      return response;
    },
    {
      mutationKey: ["create-org"],
      onSuccess() {
        queryClient.invalidateQueries([`/user/organisations/`]);
        notifySuccess("Organization successfully created");
      },
      onError(error) {
        if (isAxiosError(error)) {
          if (error.response?.status === 400) {
            notifyError("Error occured while creating organization");
          }
        } else if (typeof error === "string") {
          if (error.includes("name already exists")) {
            notifyError("Organization with this name already exists");
          }
        }
      },
    }
  );
}

function useEditOrganization() {
  const queryClient = useQueryClient();

  return useMutation(
    async (
      data: Record<
        "name" | "description" | "email" | "type" | "linkedIn" | "twitter" | "website",
        string
      > & { logo?: File; slug: string }
    ) => {
      const { slug, ...rest } = data;
      const { data: response } = await axiosPrivate.patchForm(`/organisations/${slug}/`, rest);

      return response;
    },
    {
      onSuccess() {
        queryClient.invalidateQueries([`/user/organisations/`]);
        notifySuccess("Organization successfully updated");
      },
      onError(error) {
        if (isAxiosError(error)) {
          if (error.response?.status === 400) {
            notifyError("Error occured while updating organization");
          }
        } else if (typeof error === "string") {
          if (error.includes("name already exists")) {
            notifyError("Organization with this name already exists");
          }
        }
      },
    }
  );
}

function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useMutation(
    async (id: string) => {
      const { data: response } = await axiosPrivate.patchForm(`/organisations/${id}/`);

      return response;
    },
    {
      onSuccess() {
        queryClient.invalidateQueries([`/organisations/`]);
        notifySuccess("Organization successfully deleted");
      },
      onError(error) {
        if (isAxiosError(error)) {
          if (error.response?.status === 404) {
            notifyError("Organization not found");
          }
        }
      },
    }
  );
}

function useVerifyCode() {
  return useMutation(
    async (data: Record<"pin", string>) => {
      const { data: response } = await axiosPrivate.post(`/organisations/verification/`, data);

      return response;
    },
    {
      onSuccess() {
        notifySuccess("Organization has been verified");
      },
      onError(error) {
        if (isAxiosError(error)) {
          if (error.response?.status === 400) {
            notifyError("Code has expired");
          }
        }
      },
    }
  );
}

function useResendCode() {
  return useMutation(
    async (id: string) => {
      const { data: response } = await axiosPrivate.post(`/organisations/resend-pin/${id}/`);

      return response;
    },
    {
      onError(error) {
        if (isAxiosError(error)) {
          if (error.response?.status === 404) {
            notifyError("Organization does not exist");
          }
        }
      },
    }
  );
}

function useChangeOrganizationStatus() {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id, action }: { id: string; action: Dataset["status"] }) => {
      const response = await axiosPrivate.post(`/admin/organisations/pk/${id}/actions/${action}/`);

      return response;
    },
    {
      onSuccess() {
        return queryClient.invalidateQueries([`/organisations/`]);
      },
      onError(error) {
        if (isAxiosError(error)) {
          if (error.response?.status === 400) {
            notifyError("Error occured while changing status");
          } else {
            if (typeof error === "string") {
              notifyError(error);
            }
          }
        }
      },
    }
  );
}

export {
  useCreateOrganization,
  useEditOrganization,
  useVerifyCode,
  useResendCode,
  useChangeOrganizationStatus,
  useDeleteOrganization,
};
