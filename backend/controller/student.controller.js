import Student from "../model/student.model.js";
import bcryptjs from 'bcryptjs';
export const signup = async(req,res)=>
{
    try{
        const {fullname,email,password} = req.body;
        const student = await Student.findOne({email});
        if(student)
        {
            return res.status(400).json({message:"User already exists"});
        }
        const hashPassword = await bcryptjs.hash(password,10);
        const createduser = new Student
        ({
            fullname:fullname,
            email:email, 
            password:hashPassword,
        });
        await createduser.save();
        res.status(201).json({message:"User created successfully"});
    }catch(error)
    {
        console.log("ERROR:"+error.message);
        res.status(500).json({message:"internal server error"});
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const student = await Student.findOne({ email });

        // Check if the student does not exist
        if (!student) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // If student exists, compare passwords
        const isMatch = await bcryptjs.compare(password, student.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // If passwords match, return success
        res.status(200).json({
            message: "Login successful",
            student: {
                _id: student._id,
                fullname: student.fullname,
                email: student.email
            }
        });
    } catch (error) {
        console.log("ERROR:" + error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
