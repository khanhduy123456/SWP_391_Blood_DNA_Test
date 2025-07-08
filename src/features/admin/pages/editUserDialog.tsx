import React from "react"
import { toast } from "react-hot-toast"
import { getUserById, updateUserProfile, type UpdateUserProfile, type UserProfile } from "../api/user.api"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/ui/dialog"
import { Label } from "@/shared/ui/label"
import { Input } from "@/shared/ui/input"
import { Button } from "@/shared/ui/button"

interface UserProfilePopupProps {
  userId: number
  children?: React.ReactNode
  onSuccess?: () => void
  open?: boolean
  onClose?: () => void
}

export function UserProfilePopup({ userId, children, onSuccess, open: controlledOpen, onClose }: UserProfilePopupProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen
  const setOpen = controlledOpen !== undefined
    ? (v: boolean) => { if (!v && onClose) onClose() }
    : setUncontrolledOpen
  const [isLoading, setIsLoading] = React.useState(false)
  const [profile, setProfile] = React.useState<UserProfile | null>(null)
  const [formData, setFormData] = React.useState<UpdateUserProfile>({
    name: "",
    phone: "",
    address: "",
  })

  // Lấy thông tin profile khi dialog mở
  React.useEffect(() => {
    if (open) {
      const fetchProfile = async () => {
        try {
          setIsLoading(true)
          const data = await getUserById(userId)
          setProfile(data)
          setFormData({
            name: data.name,
            phone: data.phone,
            address: data.address,
          })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          toast.error("Lấy thông tin hồ sơ thất bại")
        } finally {
          setIsLoading(false)
        }
      }
      fetchProfile()
    }
  }, [open, userId])

  // Xử lý thay đổi input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await updateUserProfile(userId, formData)
      toast.success("Cập nhật hồ sơ thành công")
      setOpen(false)
      if (onSuccess) onSuccess() // Gọi callback nếu có
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Cập nhật hồ sơ thất bại")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin hồ sơ người dùng bên dưới
          </DialogDescription>
        </DialogHeader>
        {isLoading && !profile ? (
          <div>Đang tải...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right w-28 min-w-[100px]">Email</Label>
                <div className="col-span-3">
                  <Input
                    id="email"
                    value={profile?.email || ""}
                    disabled
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right w-28 min-w-[100px]">Họ tên</Label>
                <div className="col-span-3">
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right w-28 min-w-[100px]">Số điện thoại</Label>
                <div className="col-span-3">
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right w-28 min-w-[100px]">Địa chỉ</Label>
                <div className="col-span-3">
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}