import { useState } from "react";

import { Loader2, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Button } from "@/shared/ui/button";
import { createSampleMethod } from "../api/sample.api";
import type { SampleMethod } from "../types/method";

interface AddSampleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSampleCreated?: (sample: SampleMethod) => void; // Callback khi sample method được tạo thành công
}

interface SampleFormData {
  name: string;
  description: string;
}

export const AddSampleMethodModal: React.FC<AddSampleModalProps> = ({ isOpen, onClose, onSampleCreated }) => {
  const [formData, setFormData] = useState<SampleFormData>({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SampleFormData, string>>>({});

  const handleInputChange = (field: keyof SampleFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof SampleFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập tên Sample Method";
    if (!formData.description.trim()) newErrors.description = "Vui lòng nhập mô tả";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const kit = await createSampleMethod({
        name: formData.name,
        description: formData.description,
      });
      onSampleCreated?.(kit);
      setFormData({ name: "", description: "" }); // Reset form
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setErrors({ description: "Đã có lỗi xảy ra khi tạo sample method, vui lòng thử lại" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", description: "" });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-900">
            Thêm Sample Method Mới
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-blue-900">
              Tên Sample Method *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Nhập tên Sample Method"
              className={errors.name ? "border-red-500" : ""}
              disabled={loading}
            />
            {errors.name && (
              <p className="text-red-500 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.name}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-semibold text-blue-900"
            >
              Mô tả *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Nhập mô tả Sample Method"
              className={errors.description ? "border-red-500" : ""}
              disabled={loading}
              rows={4}
            />
            {errors.description && (
              <p className="text-red-500 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.description}
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2"
          >
            {loading ? (
              <div className="flex items-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Đang tạo...
              </div>
            ) : (
              "Tạo Sample Method"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
