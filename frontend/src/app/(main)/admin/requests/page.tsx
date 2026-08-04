import AdminRequestTable from '@/components/features/request/AdminRequestTable';
import RequestFilterBar from '@/components/features/request/RequestFilterBar';
import Pagination from '@/components/shared/Pagination';
import { RequestApi } from '@/lib/api/request.api';
import { UserApi } from '@/lib/api/user.api';
import { parsePage, parseRequestStatus, parseUuid } from '@/lib/query-params';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'คำขอทั้งหมด'
};

type AdminRequestsPageProps = {
  searchParams: Promise<{
    page?: string;
    status?: string;
    userId?: string;
  }>;
};

export default async function AdminRequestsPage({
  searchParams
}: AdminRequestsPageProps) {
  const params = await searchParams;

  const status = parseRequestStatus(params.status);
  const userId = parseUuid(params.userId);

  const [requests, users] = await Promise.all([
    RequestApi.getAllRequests({
      page: parsePage(params.page),
      status,
      userId
    }),
    UserApi.getUsers()
  ]);

  const isFiltering = Boolean(status || userId);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">คำขอเบิกทั้งหมด</h1>
        <p className="text-sm text-muted-foreground">
          {isFiltering
            ? `พบ ${requests.meta.total} รายการตามเงื่อนไขที่เลือก`
            : `ทั้งหมด ${requests.meta.total} รายการ`}
        </p>
      </div>

      <RequestFilterBar users={users} />
      <AdminRequestTable requests={requests.data} />
      <Pagination
        meta={requests.meta}
        basePath="/admin/requests"
        params={params}
      />
    </div>
  );
}
