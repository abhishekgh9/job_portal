import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '../../utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2, Mail, Lock, User, Phone, Upload, Briefcase, GraduationCap } from 'lucide-react'

const Signup = () => {

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    const {loading,user} = useSelector(store=>store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();    //formdata object
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally{
            dispatch(setLoading(false));
        }
    }

    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[])
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <Navbar />
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
                <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
                    {/* Left Side - Branding/Illustration */}
                    <div className="hidden md:flex flex-col justify-center space-y-6 px-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                                Join
                                <span className="text-[#5D9C7C]"> JobPortal</span>
                            </h1>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Create your account and unlock a world of opportunities. Connect with top employers or find the perfect candidate for your team.
                            </p>
                        </div>
                        <div className="mt-8 space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-[#5D9C7C]/10 rounded-lg">
                                    <Briefcase className="h-5 w-5 text-[#5D9C7C]" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">For Recruiters</h3>
                                    <p className="text-sm text-gray-600">Post jobs and find the best talent</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-[#5D9C7C]/10 rounded-lg">
                                    <GraduationCap className="h-5 w-5 text-[#5D9C7C]" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">For Students</h3>
                                    <p className="text-sm text-gray-600">Discover opportunities and grow your career</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Signup Form */}
                    <div className="w-full flex items-center justify-center">
                        <div className="w-full max-w-[420px]">
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-9">
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Create account</h2>
                                    <p className="text-gray-600">Enter your details to get started</p>
                                </div>

                                <form onSubmit={submitHandler} className="space-y-6">
                                    {/* Full Name Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="fullname" className="text-sm font-semibold text-gray-700">
                                            Full Name
                                        </Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <Input
                                                id="fullname"
                                                type="text"
                                                value={input.fullname}
                                                name="fullname"
                                                onChange={changeEventHandler}
                                                placeholder="Abhishek"
                                                className="pl-10 h-12 border-gray-300 focus:border-[#5D9C7C] focus:ring-[#5D9C7C] transition-all placeholder:text-gray-400"
                                            />
                                        </div>
                                    </div>

                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                                            Email address
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                value={input.email}
                                                name="email"
                                                onChange={changeEventHandler}
                                                placeholder="abhishek@gmail.com"
                                                className="pl-10 h-12 border-gray-300 focus:border-[#5D9C7C] focus:ring-[#5D9C7C] transition-all placeholder:text-gray-400"
                                            />
                                        </div>
                                    </div>

                                    {/* Phone Number Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-700">
                                            Phone Number
                                        </Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <Input
                                                id="phoneNumber"
                                                type="text"
                                                value={input.phoneNumber}
                                                name="phoneNumber"
                                                onChange={changeEventHandler}
                                                placeholder="8080808080"
                                                className="pl-10 h-12 border-gray-300 focus:border-[#5D9C7C] focus:ring-[#5D9C7C] transition-all placeholder:text-gray-400"
                                            />
                                        </div>
                                    </div>

                                    {/* Password Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                                            Password
                                        </Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <Input
                                                id="password"
                                                type="password"
                                                value={input.password}
                                                name="password"
                                                onChange={changeEventHandler}
                                                placeholder="Enter your password"
                                                className="pl-10 h-12 border-gray-300 focus:border-[#5D9C7C] focus:ring-[#5D9C7C] transition-all placeholder:text-gray-400"
                                            />
                                        </div>
                                    </div>

                                    {/* Role Selection */}
                                    <div className="space-y-3">
                                        <Label className="text-sm font-semibold text-gray-700">
                                            I am a
                                        </Label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <label
                                                className={`relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                                    input.role === "student"
                                                        ? "border-[#5D9C7C] bg-[#5D9C7C]/5"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value="student"
                                                    checked={input.role === "student"}
                                                    onChange={changeEventHandler}
                                                    className="sr-only"
                                                />
                                                <div className="flex flex-col items-center gap-2">
                                                    <GraduationCap className={`h-6 w-6 ${input.role === "student" ? "text-[#5D9C7C]" : "text-gray-400"}`} />
                                                    <span className={`text-sm font-medium ${input.role === "student" ? "text-[#5D9C7C]" : "text-gray-600"}`}>
                                                        Student
                                                    </span>
                                                </div>
                                            </label>
                                            <label
                                                className={`relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                                    input.role === "recruiter"
                                                        ? "border-[#5D9C7C] bg-[#5D9C7C]/5"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value="recruiter"
                                                    checked={input.role === "recruiter"}
                                                    onChange={changeEventHandler}
                                                    className="sr-only"
                                                />
                                                <div className="flex flex-col items-center gap-2">
                                                    <Briefcase className={`h-6 w-6 ${input.role === "recruiter" ? "text-[#5D9C7C]" : "text-gray-400"}`} />
                                                    <span className={`text-sm font-medium ${input.role === "recruiter" ? "text-[#5D9C7C]" : "text-gray-600"}`}>
                                                        Recruiter
                                                    </span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Profile Picture Upload */}
                                    <div className="space-y-2">
                                        <Label htmlFor="file" className="text-sm font-semibold text-gray-700">
                                            Profile Picture (Optional)
                                        </Label>
                                        <div className="relative">
                                            <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                                            <Input
                                                id="file"
                                                accept="image/*"
                                                type="file"
                                                onChange={changeFileHandler}
                                                className="pl-10 h-12 border-gray-300 focus:border-[#5D9C7C] focus:ring-[#5D9C7C] transition-all cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#5D9C7C]/10 file:text-[#5D9C7C] hover:file:bg-[#5D9C7C]/20"
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    {loading ? (
                                        <Button
                                            type="button"
                                            disabled
                                            className="w-full h-12 bg-[#5D9C7C] hover:bg-[#4a7d63] text-white font-semibold rounded-xl shadow-lg transition-all"
                                        >
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Creating account...
                                        </Button>
                                    ) : (
                                        <Button
                                            type="submit"
                                            className="w-full h-12 bg-[#5D9C7C] hover:bg-[#4a7d63] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                                        >
                                            Create account
                                        </Button>
                                    )}

                                    {/* Login Link */}
                                    <div className="text-center pt-4">
                                        <span className="text-sm text-gray-600">
                                            Already have an account?{" "}
                                            <Link
                                                to="/login"
                                                className="font-semibold text-[#5D9C7C] hover:text-[#4a7d63] transition-colors"
                                            >
                                                Sign in
                                            </Link>
                                        </span>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup