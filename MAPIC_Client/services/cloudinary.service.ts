// Cloudinary Service - Upload ảnh lên cloud
class CloudinaryService {
  private cloudName = 'YOUR_CLOUD_NAME'; // Thay bằng cloud name của bạn
  private uploadPreset = 'YOUR_UPLOAD_PRESET'; // Thay bằng upload preset của bạn

  async uploadImage(uri: string): Promise<string> {
    try {
      // Kiểm tra config
      if (this.cloudName === 'YOUR_CLOUD_NAME' || this.uploadPreset === 'YOUR_UPLOAD_PRESET') {
        throw new Error('Chưa cấu hình Cloudinary. Vui lòng xem file CLOUDINARY_SETUP.md');
      }

      const formData = new FormData();
      
      // Tạo file object từ URI
      const filename = uri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('file', {
        uri,
        name: filename,
        type,
      } as any);
      
      formData.append('upload_preset', this.uploadPreset);
      formData.append('folder', 'mapic/avatars'); // Tổ chức ảnh vào folder

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error('Cloudinary error:', data);
        throw new Error(data.error?.message || 'Upload ảnh thất bại');
      }

      return data.secure_url; // URL của ảnh đã upload
    } catch (error: any) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  }

  // Kiểm tra đã config chưa
  isConfigured(): boolean {
    return this.cloudName !== 'YOUR_CLOUD_NAME' && this.uploadPreset !== 'YOUR_UPLOAD_PRESET';
  }
}

export default new CloudinaryService();
