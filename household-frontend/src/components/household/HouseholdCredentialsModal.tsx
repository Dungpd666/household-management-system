import { useEffect, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

type HouseholdCredentialsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  householdCode: string;
  generatedPassword: string;
  address?: string;
}

export const HouseholdCredentialsModal = ({
  isOpen,
  onClose,
  householdCode,
  generatedPassword,
  address,
}: HouseholdCredentialsModalProps) => {
  const passwordRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Auto-select password when modal opens for easy copy
      setTimeout(() => {
        passwordRef.current?.select();
      }, 100);
    }
  }, [isOpen]);

  const handleCopyPassword = () => {
    if (passwordRef.current) {
      passwordRef.current.select();
      navigator.clipboard.writeText(generatedPassword);
    }
  };

  const handleCopyCode = () => {
    if (codeRef.current) {
      codeRef.current.select();
      navigator.clipboard.writeText(householdCode);
    }
  };

  const handleCopyAll = () => {
    const text = `Mã hộ khẩu: ${householdCode}\nMật khẩu: ${generatedPassword}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <Modal
      title="✅ Tạo hộ khẩu thành công"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-6">
        {/* Alert banner */}
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1 text-sm">
              <div className="font-semibold text-amber-900 mb-1">Lưu ý quan trọng</div>
              <div className="text-amber-800">
                Hãy lưu lại hoặc chụp ảnh thông tin này. Mật khẩu chỉ hiển thị một lần và không thể khôi phục.
              </div>
            </div>
          </div>
        </div>

        {/* Household info */}
        {address && (
          <div className="rounded-2xl bg-surface-muted p-4">
            <div className="text-xs font-medium text-textc-secondary mb-2">Địa chỉ hộ</div>
            <div className="text-sm text-textc-primary">{address}</div>
          </div>
        )}

        {/* Credentials */}
        <div className="space-y-4">
          {/* Household Code */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-textc-secondary">
              Mã hộ khẩu (Tên đăng nhập)
            </label>
            <div className="flex gap-2">
              <input
                ref={codeRef}
                type="text"
                value={householdCode}
                readOnly
                className="flex-1 px-4 py-3 border-2 border-blue-200 rounded-xl bg-blue-50 font-mono text-base font-semibold text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
              />
              <Button
                type="button"
                variant="gray"
                size="md"
                onClick={handleCopyCode}
                className="rounded-xl"
                title="Sao chép mã hộ"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-textc-secondary">
              Mật khẩu (Tự động sinh)
            </label>
            <div className="flex gap-2">
              <input
                ref={passwordRef}
                type="text"
                value={generatedPassword}
                readOnly
                className="flex-1 px-4 py-3 border-2 border-emerald-200 rounded-xl bg-emerald-50 font-mono text-base font-semibold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
              />
              <Button
                type="button"
                variant="gray"
                size="md"
                onClick={handleCopyPassword}
                className="rounded-xl"
                title="Sao chép mật khẩu"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </Button>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <Button
            type="button"
            variant="gray"
            size="md"
            onClick={handleCopyAll}
            className="rounded-xl"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Sao chép tất cả
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onClose}
            className="rounded-xl"
          >
            Đã lưu, đóng cửa sổ
          </Button>
        </div>

        {/* Footer hint */}
        <div className="rounded-xl bg-surface-muted p-3 text-xs text-textc-secondary">
          💡 <strong>Gợi ý:</strong> Hãy gửi thông tin này cho chủ hộ qua tin nhắn hoặc email. 
          Chủ hộ có thể đổi mật khẩu sau khi đăng nhập lần đầu.
        </div>
      </div>
    </Modal>
  );
};
