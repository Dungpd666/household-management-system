import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { FieldHint } from '../../components/ui/FieldHint';

export const PersonCreatePage = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/persons');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Ghi nhận nhân khẩu mới" subtitle="Nhập thông tin cá nhân chi tiết" />

      <Modal isOpen={true} onClose={handleClose} title="Thêm mới nhân khẩu">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2 md:col-span-2">
            <FieldHint
              label="Họ và tên"
              hint="Nhập đầy đủ họ tên theo giấy tờ tùy thân, ví dụ: Nguyễn Văn A. Không để trống."
            >
              <input className="w-full border border-border rounded px-3 py-2 text-sm" placeholder="VD: Nguyễn Văn A" />
            </FieldHint>
          </div>
          <div className="space-y-2">
            <FieldHint
              label="Giới tính"
              hint="Chọn đúng giới tính của nhân khẩu."
            >
              <select className="w-full border border-slate-200 rounded-full px-3 py-2 text-sm bg-white/90 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary/40">
                <option>Nam</option>
                <option>Nữ</option>
                <option>Khác</option>
              </select>
            </FieldHint>
          </div>
          <div className="space-y-2">
            <FieldHint
              label="Ngày sinh"
              hint="Chọn đúng ngày, tháng, năm sinh."
            >
              <input type="date" className="w-full border border-border rounded px-3 py-2 text-sm" />
            </FieldHint>
          </div>
          <div className="space-y-2">
            <FieldHint
              label="CMND/CCCD"
              hint="Chỉ nhập số, độ dài từ 9 đến 12 chữ số."
            >
              <input className="w-full border border-border rounded px-3 py-2 text-sm" />
            </FieldHint>
          </div>
          <div className="space-y-2">
            <FieldHint
              label="Tình trạng cư trú"
              hint="Chọn đúng tình trạng: Thường trú, Tạm trú hoặc Đã chuyển đi."
            >
              <select className="w-full border border-slate-200 rounded-full px-3 py-2 text-sm bg-white/90 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary/40">
                <option>Thường trú</option>
                <option>Tạm trú</option>
                <option>Đã chuyển đi</option>
              </select>
            </FieldHint>
          </div>
          <div className="space-y-2">
            <FieldHint
              label="Quan hệ với chủ hộ"
              hint="Ví dụ: Chủ hộ, Vợ/chồng, Con, Ông/bà..."
            >
              <input className="w-full border border-border rounded px-3 py-2 text-sm" />
            </FieldHint>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="gray" size="md" type="button" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="green" size="md">Lưu nhân khẩu</Button>
        </div>
      </Modal>
    </div>
  );
};
