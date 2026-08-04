import MyRequestTable from '@/components/features/request/MyRequestTable';
import RequestFilterBar from '@/components/features/request/RequestFilterBar';
import Pagination from '@/components/shared/Pagination';
import { RequestApi } from '@/lib/api/request.api';
import { parsePage, parseRequestStatus } from '@/lib/query-params';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'คำขอของฉัน'
};

type MyRequestsPageProps = {
  searchParams: Promise<{ page?: string; status?: string }>;
};

export default async function MyRequestsPage({
  searchParams
}: MyRequestsPageProps) {
  const params = await searchParams;

  const status = parseRequestStatus(params.status);

  const requests = await RequestApi.getMyRequests({
    page: parsePage(params.page),
    status
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">คำขอของฉัน</h1>
        <p className="text-sm text-muted-foreground">
          {status
            ? `พบ ${requests.meta.total} รายการตามสถานะที่เลือก`
            : `ทั้งหมด ${requests.meta.total} รายการ`}
        </p>
      </div>

      <RequestFilterBar />
      <MyRequestTable requests={requests.data} />
      <Pagination
        meta={requests.meta}
        basePath="/requests"
        params={params}
      />
    </div>
  );
}
