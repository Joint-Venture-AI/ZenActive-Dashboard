import { CiSettings, CiUser } from "react-icons/ci";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import DashboardHome from "../pages/Main/DashboardHome/DashboardHome";
import Guests from "../pages/Main/Users/Users";
import MyProfile from "../pages/Profile/MyProfile";
import EditMyProfile from "../pages/Profile/EditMyProfile";
import TermsConditions from "../pages/Settings/TermsConditions";
import EditTermsConditions from "../pages/Settings/EditTermsConditions";
import PrivacyPolicy from "../pages/Settings/PrivacyPolicy";
import EditPrivacyPolicy from "../pages/Settings/EditPrivacyPolicy";
import { FaRegUser } from "react-icons/fa6";
import { MdOutlineSecurityUpdateWarning } from "react-icons/md";
import HostDetails from "../pages/Main/Host/HostDetails";
import { FaServicestack } from "react-icons/fa6";
import { BiMessageSquareDetail } from "react-icons/bi";
import Earnings from "../pages/Main/Earnings/Earnings";
import Setting from "../pages/Main/Setting/Setting";
import ChangePassword from "../pages/Main/Setting/Change-password/ChangePassword";
import ForgotPassword from "../pages/Main/Setting/Change-password/ForgotPassword";
import VerifyEmail from "../pages/Main/Setting/Change-password/VerifyEmail";
import Trust from "../pages/Settings/Trust";
import EditTrust from "../pages/Settings/EditTrust";
import { TbCoin } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { LuCrown } from "react-icons/lu";
import Subscription from "../pages/Main/Subscription/Subscription";
import Notifications from "../pages/Main/Notifications/Notifications";
import AddSubscription from "../pages/Main/AddSubscription/AddSubscription";
import EditSubscription from "../pages/Main/EditSubscription/EditSubscription";
import { BiDish } from "react-icons/bi";
import Meals from "../pages/Main/Meals/Meals";
import Workouts from "../pages/Main/Workouts/Workouts";
import { CiDumbbell } from "react-icons/ci";
import Store from "../pages/Main/Store/Store";
import { PiHandbagSimple } from "react-icons/pi";
import AddMeal from "../pages/Main/AddMeal/AddMeal";
import EditMeal from "../pages/Main/EditMeal/EditMeal";
import EditChallenge from "../pages/Main/EditExercise/EditExercise";
import AddWorkout from "../pages/Main/AddWorkout/AddWorkout";
import EditWorkout from "../pages/Main/EditWorkout/EditWorkout";
import AddBadge from "../pages/Main/AddBadge/AddBadge";
import EditBadge from "../pages/Main/EditBadge/EditBadge";
import { PiPersonSimpleBikeBold } from "react-icons/pi";
import Exercise from "../pages/Main/Exercise/Exercise";
import { MdOutlineVideoLibrary } from "react-icons/md";
import WorkoutVideos from "../pages/Main/WorkoutVideos/WorkoutVideos";
import EditWorkoutVideo from "../pages/Main/EditWorkoutVideo/EditWorkoutVideo";
import AddWorkoutVideo from "../pages/Main/AddWorkoutVideo/AddWorkoutVideo";
import WorkoutPlans from "../pages/Main/WorkoutPlans/WorkoutPlans";
import AddExercise from "../pages/Main/AddExercise/AddExercise";
import EditExercise from "../pages/Main/EditExercise/EditExercise";
import AddWorkoutPlan from "../pages/Main/AddWorkoutPlan/AddWorkoutPlan";
import EditWorkoutPlan from "../pages/Main/EditWorkoutPlan/EditWorkoutPlan";
import { MdManageHistory } from "react-icons/md";
import AddWorkoutVideoNormal from "../pages/Main/AddWorkoutVideo/AddWorkoutVideoNormal";
import ResetPassword from "../pages/Main/Setting/Change-password/ResetPassword";
import PrivateProtectedRoute from "../routes/PrivateProtectedRoute";

export const dashboardItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: RiDashboardHorizontalFill,
    element: (
      <PrivateProtectedRoute>
        <DashboardHome />
      </PrivateProtectedRoute>
    ),
  },
  {
    name: "Earnings",
    path: "earnings",
    icon: TbCoin,
    element: <Earnings />,
  },
  {
    name: "Users",
    path: "users",
    icon: FaRegUser,
    element: <Guests />,
  },
  // {
  //   name: "Approve Request",
  //   rootPath: "approveRequest",
  //   icon: GrMoney,
  //   children: [
  //     {
  //       name: "Studio Post",
  //       path: "approveRequest/all-earnings",
  //       icon: LuWallet,
  //       element: <StudioPost />,
  //     },
  //     {
  //       name: "Trainer Post",
  //       path: "approveRequest/withdraw",
  //       icon: PiHandWithdrawBold,
  //       element: <TrainerPost />,
  //     },
  //   ],
  // },
  {
    path: "notifications",
    element: <Notifications />,
  },
  {
    path: "add-subscription",
    element: <AddSubscription />,
  },
  {
    path: "edit-subscription",
    element: <EditSubscription />,
  },
  {
    path: "meals/add-meal",
    element: <AddMeal />,
  },
  {
    path: "meals/edit-meal/:mealId",
    element: <EditMeal />,
  },
  {
    path: "exercise/add-exercise",
    element: <AddExercise />,
  },
  {
    path: "exercise/edit-exercise/:exerciseId",
    element: <EditExercise />,
  },
  {
    path: "workoutPlans/add-workout-plan",
    element: <AddWorkoutPlan />,
  },
  {
    path: "workoutPlans/edit-workout-plan/:workoutPlanId",
    element: <EditWorkoutPlan />,
  },
  {
    path: "workouts/add-workout",
    element: <AddWorkout />,
  },
  {
    path: "workouts/edit-workout/:workoutId",
    element: <EditWorkout />,
  },
  {
    path: "workout-videos/add-workout-video",
    element: <AddWorkoutVideoNormal />,
    // element: <AddWorkoutVideo />,
  },
  {
    path: "workout-videos/edit-workout-video/:workoutId",
    element: <EditWorkoutVideo />,
  },
  {
    path: "store/add-badge",
    element: <AddBadge />,
  },
  {
    path: "store/edit-badge/:badgeId",
    element: <EditBadge />,
  },
  // {
  //   path: '/reviews',
  //   element: <Review></Review>
  // },

  // {
  //   name: "Driver",
  //   path: "driver",
  //   icon: GrUserManager,
  //   element: <Driver />,
  // },
  // {
  //   name: "Driver Request",
  //   path: "driver-request",
  //   icon: PiLaptopThin,
  //   element: <DriverRequest />,
  // },
  {
    name: "Subscription",
    path: "subscription",
    icon: LuCrown,
    element: <Subscription />,
  },
  {
    name: "Meals",
    path: "meals",
    icon: BiDish,
    element: <Meals />,
  },
  {
    name: "Exercise ",
    path: "exercise",
    icon: PiPersonSimpleBikeBold,
    element: <Exercise />,
  },
  {
    name: "Workouts",
    path: "workouts",
    icon: CiDumbbell,
    element: <Workouts />,
  },
  {
    name: "Workout Plans",
    path: "workoutPlans",
    icon: MdManageHistory,
    element: <WorkoutPlans />,
  },
  {
    name: "Workout Videos",
    path: "workout-videos",
    icon: MdOutlineVideoLibrary,
    element: <WorkoutVideos />,
  },
  {
    name: "Store",
    path: "store",
    icon: PiHandbagSimple,
    element: <Store />,
  },
  {
    name: "Settings",
    path: "settings",
    icon: IoSettingsOutline,
    element: <Setting />,
  },
  {
    path: "/hosts/:id",
    element: <HostDetails />,
  },
  {
    name: "Settings",
    rootPath: "settings",
    icon: CiSettings,
    children: [
      {
        name: "Personal Information",
        path: "settings/profile",
        icon: CiUser,
        element: <MyProfile />,
      },
      {
        path: "settings/profile/edit",
        element: <EditMyProfile />,
      },
      {
        name: "Change Password",
        icon: FaServicestack,
        path: "settings/change-password",
        element: <ChangePassword />,
      },
      {
        path: "settings/change-password/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "settings/change-password/forgot-password/verify-email",
        element: <VerifyEmail />,
      },
      {
        path: "settings/change-password/forgot-password/verify-email/reset-password",
        element: <ResetPassword />,
      },
      {
        name: "Terms & Condition",
        icon: FaServicestack,
        path: "settings/terms-conditions",
        element: <TermsConditions />,
      },
      {
        path: "settings/terms-conditions/edit",
        element: <EditTermsConditions />,
      },
      {
        name: "Privacy Policy",
        icon: MdOutlineSecurityUpdateWarning,
        path: "settings/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "settings/privacy-policy/edit",
        element: <EditPrivacyPolicy />,
      },
      {
        name: "About Us",
        icon: BiMessageSquareDetail,
        path: "settings/about-us",
        element: <Trust />,
      },
      {
        path: "settings/about-us/edit",
        element: <EditTrust />,
      },
    ],
  },
];
