import User from "../models/user.js"
import bcrypt from "bcryptjs"
import joi from "joi"
import jwt from "jsonwebtoken"

const tokenSecret = 'secret'
export const login = async (req, res) => {
    const { compareSync } = bcrypt
    try {
        const email = req.body.email
        const password = req.body.password

        const loginSchema = joi.object({
            email: joi.string().email().min(3).max(32).required().messages({
                "string.email": "Email không đúng định dạng",
                "string.min": "Tối thiếu là 3 ký tự",
                "string.max": "Tối đa là là 32 ký tự"
            }),
            password: joi.string().min(6).max(32).required().messages({
                "string.password": "Mật khẩu không đúng định dạng",
                "string.min": "Tối thiếu là 6 ký tự",
                "string.max": "Tối đa là là 32 ký tự"
            }),
        })

        const validate = loginSchema.validate({ email, password })

        if (validate.error) {
            return res.status(400).json({
                error: validate.error.details[0].message
            })
        }
        const findUser = await User.findOne({ email }).lean()
        if (!findUser) {
            return res.status(401).json({
                error: "Không tìm thấy người dùng"
            })
        }

        const checkPassword = compareSync(password, findUser.password)

        const accessToken = jwt.sign({
            id: findUser._id,
        }, process.env.SCRET_KEY, { expiresIn: '1d' })


        const {
            password: userPassword,
            ...returnUser
        } = findUser

        if (!checkPassword) {
            return res.status(401).json({
                error: "Sai mật khẩu"
            })
        }
        if (findUser) {
            return res.status(200).json({
                message: "Đăng nhập thành công",
                user: returnUser,
                accessToken
            })
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}
export const signUp = async (req, res) => {
    const { hashSync, genSaltSync } = bcrypt
    try {
        const { name, email, password, role, age, phoneNumber, address } = req.body

        // schema joi
        const signupSchema = joi.object({
            name: joi.string().max(32).required().messages({
                "string.max": "Name không được quá 32 kí tự",
                "string.name": "Name không đúng định dạng",
                "any.required": "Vui lòng nhập Name"
            }),
            email: joi.string().email().max(32).required().messages({
                "string.email": "Email không đúng định dạng",
                "string.max": "Email tối đa là 32 ký tự",

            }),
            password: joi.string().min(6).max(32).required().messages({
                "string.min": "Password không được nhỏ hơn 6 kí tự",
                "string.max": "Password không được vượt quá 32 kí tự",
                "string.password": "Password không đúng định dạng",
                "any.required": "Vui lòng nhập Password"
            }),
            role: joi.string().required().message({
                "string.role": "Role không đúng định dạng",
                "any.required": "Vui lòng nhập Role"
            }),
            age: joi.number().required().message({
                "number.age": "Age không đúng định dạng của nó",
                "any.required": "Vui lòng nhập Age"
            }),
            phoneNumber: joi.string().max(10).required().message({
                "string.phoneNumber": "Phone number phải là chữ số",
                "string.max": "Phone number không được vượt quá 10 chữ số",
                "any.required": "Vui lòng nhập Phone Number"
            }),
            address: joi.string().min(10).required().message({
                "string.min": "Address không được bé hơn 10 chữ cái",
                "any.required": "Vui lòng nhập Address"
            })
        })

        const { error } = signupSchema.validate({ name, email, password, role, age, phoneNumber, address });
        if (error) {
            return res.status(400).json({
                error: error.details[0].message
            })
        }

        const findUser = await User.findOne({ email })

        if (findUser) {
            return res.status(409).json({
                message: "Người dùng đã tồn tại"
            })
        }

        const salt = genSaltSync()
        const hashPassword = hashSync(password, salt)

        const user = await User.create({
            email,
            password: hashPassword,
            name,
            role,
            age,
            phoneNumber,
            address
        })

        // Loại bỏ trường password từ kết quả trả về
        const userWithoutPassword = user.toObject()
        delete userWithoutPassword.password

        return res.status(200).json({
            message: "Tạo người dùng thành công",
            user: userWithoutPassword
        })

    } catch (error) {
        return res.status(500).json({ error: "Đã xảy ra lỗi trong quá trình xử lý yêu cầu." })
    }
}
export const createUser = async (req, res) => {
    const { hashSync, genSaltSync } = bcrypt
    try {
        const data = req.body
        const { password, email } = data;

        const findUser = await User.findOne({ email })

        if (findUser) {
            return res.status(409).json({
                message: "Người dùng đã tồn tại"
            })
        }

        const salt = genSaltSync()
        const hashPassword = hashSync(password, salt)

        const result = await User.create({ ...data, password: hashPassword })

        return res.status(201).json({
            message: "Thêm người dùng thành công",
            result
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}
export const getPagingUser = async (req, res) => {
    try {
        const query = req.query
        const users = await User.find({ role: "customer" })
            .skip(query.pageSize * query.pageIndex - query.pageSize)
            .limit(query.pageSize).sort({ createdAt: "desc" })

        const countusers = await User.countDocuments({ role: "customer" })
        const totalPage = Math.ceil(countusers / query.pageSize)

        return res.status(200).json({ users, totalPage, count: countusers })
    } catch (error) {
        return res.status(500).json(error)
    }
}
export const editUser = async (req, res) => {
    try {
        const id = req.params.id
        const name = req.body.name
        const email = req.body.email
        const age = req.body.age
        const phoneNumber = req.body.phoneNumber
        const address = req.body.address

        const editSchema = joi.object({
            name: joi.string().max(32).required().messages({
                "string.max": "Name không được quá 32 kí tự",
                "string.base": "Name không đúng định dạng",
                "any.required": "Vui lòng nhập Name"
            }),
            email: joi.string().email().max(32).required().messages({
                "string.email": "Email không đúng định dạng",
                "string.max": "Email tối đa là 32 ký tự",
                "any.required": "Vui lòng nhập Email"
            }),
            age: joi.number().required().messages({
                "number.base": "Age không đúng định dạng của nó",
                "any.required": "Vui lòng nhập Age"
            }),
            phoneNumber: joi.string().max(10).required().messages({
                "string.base": "Phone number phải là chữ số",
                "string.max": "Phone number không được vượt quá 10 chữ số",
                "any.required": "Vui lòng nhập Phone Number"
            }),
            address: joi.string().min(10).required().messages({
                "string.min": "Address không được bé hơn 10 chữ cái",
                "any.required": "Vui lòng nhập Address"
            })
        })

        const { error } = editSchema.validate({ name, email, age, phoneNumber, address }, { abortEarly: false })
        if (error) {
            return res.status(400).json({
                error: error.details.map(e => e.message)
            })
        }

        const updateUser = await User.findByIdAndUpdate(id, {
            name,
            email,
            age,
            phoneNumber,
            address
        }, { new: true }).select("-password")

        if (!updateUser) {
            return res.status(404).json({ message: "Không tìm thấy người dùng để cập nhật." })
        }

        return res.status(200).json({
            message: "Cập nhật thành công",
            user: updateUser
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const changePassword = async (req, res) => {
    const { compareSync, genSaltSync, hashSync } = bcrypt
    try {
        const id = req.params.id
        const oldPassword = req.body.oldPassword
        const newPassword = req.body.newPassword

        const changePassSchema = joi.object({
            oldPassword: joi.string().min(6).max(32).required().messages({
                "string.min": "Mật khẩu cũ phải có ít nhất 6 ký tự",
                "string.max": "Mật khẩu cũ không được vượt quá 32 ký tự",
                "any.required": "Mật khẩu cũ là bắt buộc"
            }),
            newPassword: joi.string().min(6).max(32).required().messages({
                "string.min": "Mật khẩu mới phải có ít nhất 6 ký tự",
                "string.max": "Mật khẩu mới không được vượt quá 32 ký tự",
                "any.required": "Mật khẩu mới là bắt buộc"
            })
        });

        const { error } = changePassSchema.validate({ oldPassword, newPassword });
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({
                error: "Không tìm thấy người dùng"
            })
        }
        const checkPassword = compareSync(oldPassword, user.password)

        if (!checkPassword) {
            return res.status(400).json({
                error: "Sai mật khẩu cũ"
            })
        }
        // Mã hóa mật khẩu
        const salt = genSaltSync()
        const hashPassword = hashSync(newPassword, salt)

        const updateUser = await User.findByIdAndUpdate(id, {
            password: hashPassword
        }).select("-password")

        return res.status(200).json({
            message: "Cập nhật mật khẩu thành công",
            user: updateUser
        })
    } catch (error) {
        return res.status(500).json({ error })
    }
}
export const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.deleteOne({ _id: id })
        if (!user) {
            return res.status(400).json({
                message: "Không tìm thấy người dùng"
            })
        }
        return res.status(200).json({ message: "Xóa người dùng thành công" })
    } catch (error) {
        return res.status(500).json({ error })
    }
}
export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        return res.status(200).json({ user })
    } catch (error) {
        return res.status(500).json({ error });
    }
}
export const getAllUser = async (req, res) => {
    try {
        const result = await User.find();

        // Lấy ngày hiện tại
        const currentDate = new Date();
        // Lấy ngày 30 ngày trước
        const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Đếm số lượng người dùng theo vai trò
        const adminCount = result.filter(user => user.role === "admin").length;
        const customerCount = result.filter(user => user.role === "customer").length;

        // Đếm số lượng người dùng được tạo trong 30 ngày gần đây
        const newUsersCount = result.filter(user => new Date(user.createdAt) > thirtyDaysAgo).length;

        return res.status(200).json({
            users: result,
            adminCount: adminCount,
            customerCount: customerCount,
            newUsersCount: newUsersCount
        });

    } catch (error) {
        return res.status(500).json({ error })
    }
}
export const getPagingAdmin = async (req, res) => {
    try {
        const query = req.query
        const admins = await User.find({ role: "admin" })
            .skip(query.pageSize * query.pageIndex - query.pageSize)
            .limit(query.pageSize).sort({ createdAt: "desc" })

        const countAdmins = await User.countDocuments({ role: "admin" })
        const totalPage = Math.ceil(countAdmins / query.pageSize)

        return res.status(200).json({ admins, totalPage, count: countAdmins })
    } catch (error) {
        return res.status(500).json(error)
    }
}
export const searchUser = async (req, res) => {
    try {
        const { keyword, option } = req.body;

        if (!keyword || !option) {
            const noKeyword = await User.find()
            return res.status(200).json({ noKeyword });
        }

        let searchField = {};
        if (option === "name") {
            searchField = { name: { $regex: keyword, $options: 'i' } };
        } else if (option === "email") {
            searchField = { email: { $regex: keyword, $options: 'i' } };
        }

        const customers = await User.find({ ...searchField, role: 'customer' });

        if (!customers || customers.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy người dùng!" });
        }

        return res.status(200).json({ customers });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
export const searchAdmin = async (req, res) => {
    try {
        const { keyword, option } = req.body;

        if (!keyword || !option) {
            const noKeyword = await User.find()
            return res.status(200).json({ noKeyword });
        }

        let searchField = {};
        if (option === "name") {
            searchField = { name: { $regex: keyword, $options: 'i' } };
        } else if (option === "email") {
            searchField = { email: { $regex: keyword, $options: 'i' } };
        }

        const admins = await User.find({ ...searchField, role: 'admin' });

        if (!admins || admins.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy người dùng!" });
        }

        return res.status(200).json({ admins });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id
        const user = await User.findById(userId).select('-password')
        return res.status(200).json({
            user
        })
    } catch (error) {
        return res.status(500).json({ error })
    }
}
export const getAgeUser = async (req, res) => {
    try {
        const users = await User.find({ role: "customer" });
        let countAdult = 0;
        let countChild = 0;
        let countMiddleAged = 0;

        users.forEach(user => {
            if (user.age > 40) {
                countMiddleAged++;
            } else if (user.age >= 18) {
                countAdult++;
            } else {
                countChild++;
            }
        });

        const data = [
            { name: "Adult", value: countAdult },
            { name: "Children", value: countChild },
            { name: "Middle-age", value: countMiddleAged },
        ];

        return res.status(200).json({ data });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

