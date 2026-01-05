'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Check, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const { language, setLanguage } = useLanguage();

  const [name, setName] = useState(session?.user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMessage(null);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        await update({ name });
        setProfileMessage({
          type: 'success',
          text: language === 'vn' ? 'Đã lưu thành công' : 'Saved successfully',
        });
      } else {
        throw new Error('Failed to save');
      }
    } catch {
      setProfileMessage({
        type: 'error',
        text: language === 'vn' ? 'Có lỗi xảy ra' : 'Something went wrong',
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        type: 'error',
        text: language === 'vn' ? 'Mật khẩu không khớp' : 'Passwords do not match',
      });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMessage({
        type: 'error',
        text: language === 'vn' ? 'Mật khẩu phải có ít nhất 8 ký tự' : 'Password must be at least 8 characters',
      });
      return;
    }

    setIsSavingPassword(true);

    try {
      const res = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (res.ok) {
        setPasswordMessage({
          type: 'success',
          text: language === 'vn' ? 'Đã đổi mật khẩu thành công' : 'Password changed successfully',
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to change password');
      }
    } catch (err) {
      setPasswordMessage({
        type: 'error',
        text: err instanceof Error ? err.message : (language === 'vn' ? 'Có lỗi xảy ra' : 'Something went wrong'),
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {language === 'vn' ? 'Cài đặt tài khoản' : 'Account Settings'}
      </h1>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{language === 'vn' ? 'Thông tin cá nhân' : 'Profile Information'}</CardTitle>
          <CardDescription>
            {language === 'vn' ? 'Cập nhật tên và email của bạn' : 'Update your name and email'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            {profileMessage && (
              <div
                className={`p-3 rounded-lg flex items-center gap-2 ${
                  profileMessage.type === 'success'
                    ? 'bg-green-50 text-green-600'
                    : 'bg-red-50 text-red-600'
                }`}
              >
                {profileMessage.type === 'success' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                {profileMessage.text}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">{language === 'vn' ? 'Họ và tên' : 'Full Name'}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={language === 'vn' ? 'Nguyễn Văn A' : 'John Doe'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={session?.user?.email || ''}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">
                {language === 'vn' ? 'Email không thể thay đổi' : 'Email cannot be changed'}
              </p>
            </div>

            <Button type="submit" disabled={isSavingProfile}>
              {isSavingProfile ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {language === 'vn' ? 'Đang lưu...' : 'Saving...'}
                </>
              ) : (
                language === 'vn' ? 'Lưu thay đổi' : 'Save Changes'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{language === 'vn' ? 'Ngôn ngữ' : 'Language'}</CardTitle>
          <CardDescription>
            {language === 'vn' ? 'Chọn ngôn ngữ hiển thị' : 'Choose your display language'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={language}
            onValueChange={(value) => setLanguage(value as 'vn' | 'en')}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="vn" id="vn" />
              <Label htmlFor="vn">🇻🇳 Tiếng Việt</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="en" id="en" />
              <Label htmlFor="en">🇺🇸 English</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Password Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{language === 'vn' ? 'Đổi mật khẩu' : 'Change Password'}</CardTitle>
          <CardDescription>
            {language === 'vn' ? 'Cập nhật mật khẩu đăng nhập' : 'Update your login password'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            {passwordMessage && (
              <div
                className={`p-3 rounded-lg flex items-center gap-2 ${
                  passwordMessage.type === 'success'
                    ? 'bg-green-50 text-green-600'
                    : 'bg-red-50 text-red-600'
                }`}
              >
                {passwordMessage.type === 'success' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                {passwordMessage.text}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="currentPassword">
                {language === 'vn' ? 'Mật khẩu hiện tại' : 'Current Password'}
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">
                {language === 'vn' ? 'Mật khẩu mới' : 'New Password'}
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {language === 'vn' ? 'Xác nhận mật khẩu mới' : 'Confirm New Password'}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={isSavingPassword}>
              {isSavingPassword ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {language === 'vn' ? 'Đang đổi...' : 'Changing...'}
                </>
              ) : (
                language === 'vn' ? 'Đổi mật khẩu' : 'Change Password'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
