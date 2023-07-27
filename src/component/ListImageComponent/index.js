import React, { useState, useEffect } from 'react';
import { Upload, Button, Modal, message } from 'antd';
import ImgCrop from 'antd-img-crop';
import { PlusOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const ListImage = ({ imageUrls, handleDelete, upload, size }) => {
  const [fileList, setFileList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const onChange = ({ fileList: newFileList }) => {
    if (selectMode) {
      const currentSelectedImage = newFileList.find(
        (file) => file.uid === selectedImage?.uid
      );

      if (currentSelectedImage) {
        setSelectedImage(currentSelectedImage);
      } else {
        setSelectedImage(null);
      }
    }
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;

    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }

    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
    handleSelectImage(file);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    const pendingFiles = [];

    fileList.forEach((file) => {
      if (!file.url) {
        formData.append('files', file.originFileObj);
      }
    });

    await upload(formData);
  };

  const handleSelectImage = (file) => {
    if (selectMode) {
      if (selectedImage && selectedImage.uid === file.uid) {
        setSelectedImage(null);
        selectItem(null);
      } else {
        setSelectedImage(file);
        selectItem(file.url);
      }
    }
  };

  const handleRemove = (file) => {
    confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc muốn xóa tệp này?',
      okText: 'Đồng ý',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        handleDelete(file.url);
      },
      onCancel() {
        fileList.push(file);
      },
    });
  };

  const beforeUpload = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const newFile = {
          uid: Date.now(),
          name: file.name,
          status: 'done',
          url: reader.result,
        };
        setFileList([...fileList, newFile]);
        resolve(null);
      };
    });
  };

  useEffect(() => {
    setFileList([]);
    if (Array.isArray(imageUrls)) {
      const images = imageUrls?.map((url, index) => ({
        uid: url,
        name: `image-${index}.png`,
        status: 'done',
        url: url,
      }));
      setFileList(images);
    }
  }, [imageUrls]);

  React.useEffect(() => {
    fileList.forEach((file) => {
      file.status = imageUrls.includes(file.url) ? 'done' : 'error';
    });
  }, [fileList]);

  return (
    <div>
      <ImgCrop rotationSlider>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={onChange}
          beforeUpload={beforeUpload}
          onPreview={onPreview}
          onRemove={handleRemove}
          showPreviewIcon={false}
          className={selectMode ? 'select-mode' : ''}
        >
          {fileList.length < size && (
            <div>
              <PlusOutlined />
              <div className="ant-upload-text">Upload</div>
            </div>
          )}
        </Upload>
      </ImgCrop>
    </div>
  );
};

export default ListImage;
