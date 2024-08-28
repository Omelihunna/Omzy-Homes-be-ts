import { v2 as cloudinaryV2, UploadApiOptions } from 'cloudinary';
import { CloudinaryStorage as MulterCloudinaryStorage } from 'multer-storage-cloudinary';

class CloudinaryService {
    private cloudinary: typeof cloudinaryV2;
    private storage: MulterCloudinaryStorage;

    constructor() {
        this.cloudinary = cloudinaryV2;
        this.cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_KEY,
            api_secret: process.env.CLOUDINARY_SECRET
        });

        this.storage = new MulterCloudinaryStorage({
            cloudinary: this.cloudinary,
            // params: {
            //     folder: 'Prototype',
            //     allowedFormats: ['jpeg', 'png', 'jpg']
            // }
        });
    }

    public getCloudinary(): typeof cloudinaryV2 {
        return this.cloudinary;
    }

    public getStorage(): MulterCloudinaryStorage {
        return this.storage;
    }
}

export default CloudinaryService;
