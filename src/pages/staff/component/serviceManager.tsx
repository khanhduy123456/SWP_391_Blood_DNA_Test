'use client';

import { useEffect, useState } from 'react';
import { Pencil, MoreVertical } from 'lucide-react';
import type { Service } from '../type/service';
import { getPagedService, type PagedServiceResponse } from '../api/service.api';

function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function ServiceManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: PagedServiceResponse = await getPagedService(pageNumber, pageSize);
      setServices(response.data);
      setTotalPages(response.totalPages);
      setTotalRecords(response.totalRecords);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Lấy dữ liệu Service thất bại');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [pageNumber]); // Gọi lại khi pageNumber thay đổi

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handleNextPage = () => {
    if (pageNumber < totalPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  return (
    <div className="p-10 bg-gradient-to-br from-green-50 to-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-green-700">Quản lý Các loại dịch vụ xét nghiệm/ Service</h2>
        </div>

        <div className="overflow-x-auto relative z-0 rounded-xl shadow-lg border border-green-100 bg-white min-h-[300px]">
          {loading && (
            <div className="text-center py-10 text-green-600 font-semibold">
              Đang tải dữ liệu...
            </div>
          )}

          {error && (
            <div className="text-center py-10 text-red-600 font-semibold">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              <table className="min-w-full text-sm text-left relative z-0">
                <thead>
                  <tr className="bg-green-100 text-green-700 uppercase text-xs tracking-wider">
                    <th className="py-3 px-5">ID</th>
                    <th className="py-3 px-5">Tên</th>
                    <th className="py-3 px-5">Mô tả</th>
                    <th className="py-3 px-5">Loại</th>
                    <th className="py-3 px-5">Giá</th>
                    <th className="py-3 px-5">Ngày tạo</th>
                    <th className="py-3 px-5 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {services.length > 0 ? (
                    services.map((service: Service) => (
                      <tr key={service.id} className="border-b hover:bg-green-50 transition">
                        <td className="py-3 px-5">{service.id}</td>
                        <td className="py-3 px-5 font-medium">{service.name}</td>
                        <td className="py-3 px-5">{service.description}</td>
                        <td className="py-3 px-5">{service.type}</td>
                        <td className="py-3 px-5">{service.price}</td>
                        <td className="py-3 px-5">{formatDateTime(service.createAt)}</td>
                        <td className="py-3 px-5 text-center relative">
                          <button
                            className="p-2 hover:bg-green-100 rounded-full"
                            onClick={() =>
                              setOpenMenuId(openMenuId === service.id ? null : service.id)
                            }
                          >
                            <MoreVertical size={20} />
                          </button>

                          {openMenuId === service.id && (
                            <div className="absolute right-5 z-10 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                              <button
                                onClick={() => {
                                  alert(`Chỉnh sửa: ${service.name}`);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm"
                              >
                                <Pencil size={16} />
                                Chỉnh sửa
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-6 text-gray-500">
                        Không có Service nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Phân trang */}
              {services.length > 0 && (
                <div className="flex justify-between items-center py-4 px-5">
                  <div className="text-sm text-gray-600">
                    Hiển thị {services.length} / {totalRecords} bản ghi (Trang {pageNumber} / {totalPages})
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePreviousPage}
                      disabled={pageNumber === 1}
                      className={`px-4 py-2 rounded-lg ${
                        pageNumber === 1
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      Trang trước
                    </button>
                    <button
                      onClick={handleNextPage}
                      disabled={pageNumber === totalPages}
                      className={`px-4 py-2 rounded-lg ${
                        pageNumber === totalPages
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      Trang sau
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServiceManager;