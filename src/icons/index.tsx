import React from "react";
import PlusIconRaw from "./plus.svg";
import CloseIconRaw from "./close.svg";
import BoxIconRaw from "./box.svg";
import CheckCircleIconRaw from "./check-circle.svg";
import AlertIconRaw from "./alert.svg";
import InfoIconRaw from "./info.svg";
import ErrorIconRaw from "./info-hexa.svg";
import BoltIconRaw from "./bolt.svg";
import ArrowUpIconRaw from "./arrow-up.svg";
import ArrowDownIconRaw from "./arrow-down.svg";
import FolderIconRaw from "./folder.svg";
import VideoIconRaw from "./videos.svg";
import AudioIconRaw from "./audio.svg";
import GridIconRaw from "./grid.svg";
import FileIconRaw from "./file.svg";
import DownloadIconRaw from "./download.svg";
import ArrowRightIconRaw from "./arrow-right.svg";
import GroupIconRaw from "./group.svg";
import BoxIconLineRaw from "./box-line.svg";
import ShootingStarIconRaw from "./shooting-star.svg";
import DollarLineIconRaw from "./dollar-line.svg";
import TrashBinIconRaw from "./trash.svg";
import AngleUpIconRaw from "./angle-up.svg";
import AngleDownIconRaw from "./angle-down.svg";
import PencilIconRaw from "./pencil.svg";
import CheckLineIconRaw from "./check-line.svg";
import CloseLineIconRaw from "./close-line.svg";
import ChevronDownIconRaw from "./chevron-down.svg";
import ChevronUpIconRaw from "./chevron-up.svg";
import PaperPlaneIconRaw from "./paper-plane.svg";
import LockIconRaw from "./lock.svg";
import EnvelopeIconRaw from "./envelope.svg";
import UserIconRaw from "./user-line.svg";
import CalenderIconRaw from "./calender-line.svg";
import EyeIconRaw from "./eye.svg";
import EyeCloseIconRaw from "./eye-close.svg";
import TimeIconRaw from "./time.svg";
import CopyIconRaw from "./copy.svg";
import ChevronstartIconRaw from "./chevron-left.svg";
import UserCircleIconRaw from "./user-circle.svg";
import TaskIconRaw from "./task-icon.svg";
import ListIconRaw from "./list.svg";
import TableIconRaw from "./table.svg";
import PageIconRaw from "./page.svg";
import PieChartIconRaw from "./pie-chart.svg";
import BoxCubeIconRaw from "./box-cube.svg";
import PlugInIconRaw from "./plug-in.svg";
import DocsIconRaw from "./docs.svg";
import MailIconRaw from "./mail-line.svg";
import HorizontaLDotsRaw from "./horizontal-dots.svg";
import ChatIconRaw from "./chat.svg";
import MoreDotIconRaw from "./more-dot.svg";
import BellIconRaw from "./bell.svg";

function wrapIcon(M: any) {
  return function Icon(props: any) {
    const C = M as any;
    if (typeof C === "function") return <C {...props} />;
    const src = (C as any)?.src || (typeof C === "string" ? C : undefined);
    return <img src={src} alt="" {...props} />;
  };
}

const PlusIcon = wrapIcon(PlusIconRaw);
const CloseIcon = wrapIcon(CloseIconRaw);
const BoxIcon = wrapIcon(BoxIconRaw);
const CheckCircleIcon = wrapIcon(CheckCircleIconRaw);
const AlertIcon = wrapIcon(AlertIconRaw);
const InfoIcon = wrapIcon(InfoIconRaw);
const ErrorIcon = wrapIcon(ErrorIconRaw);
const BoltIcon = wrapIcon(BoltIconRaw);
const ArrowUpIcon = wrapIcon(ArrowUpIconRaw);
const ArrowDownIcon = wrapIcon(ArrowDownIconRaw);
const FolderIcon = wrapIcon(FolderIconRaw);
const VideoIcon = wrapIcon(VideoIconRaw);
const AudioIcon = wrapIcon(AudioIconRaw);
const GridIcon = wrapIcon(GridIconRaw);
const FileIcon = wrapIcon(FileIconRaw);
const DownloadIcon = wrapIcon(DownloadIconRaw);
const ArrowRightIcon = wrapIcon(ArrowRightIconRaw);
const GroupIcon = wrapIcon(GroupIconRaw);
const BoxIconLine = wrapIcon(BoxIconLineRaw);
const ShootingStarIcon = wrapIcon(ShootingStarIconRaw);
const DollarLineIcon = wrapIcon(DollarLineIconRaw);
const TrashBinIcon = wrapIcon(TrashBinIconRaw);
const AngleUpIcon = wrapIcon(AngleUpIconRaw);
const AngleDownIcon = wrapIcon(AngleDownIconRaw);
const PencilIcon = wrapIcon(PencilIconRaw);
const CheckLineIcon = wrapIcon(CheckLineIconRaw);
const CloseLineIcon = wrapIcon(CloseLineIconRaw);
const ChevronDownIcon = wrapIcon(ChevronDownIconRaw);
const ChevronUpIcon = wrapIcon(ChevronUpIconRaw);
const PaperPlaneIcon = wrapIcon(PaperPlaneIconRaw);
const LockIcon = wrapIcon(LockIconRaw);
const EnvelopeIcon = wrapIcon(EnvelopeIconRaw);
const UserIcon = wrapIcon(UserIconRaw);
const CalenderIcon = wrapIcon(CalenderIconRaw);
const EyeIcon = wrapIcon(EyeIconRaw);
const EyeCloseIcon = wrapIcon(EyeCloseIconRaw);
const TimeIcon = wrapIcon(TimeIconRaw);
const CopyIcon = wrapIcon(CopyIconRaw);
const ChevronstartIcon = wrapIcon(ChevronstartIconRaw);
const UserCircleIcon = wrapIcon(UserCircleIconRaw);
const TaskIcon = wrapIcon(TaskIconRaw);
const ListIcon = wrapIcon(ListIconRaw);
const TableIcon = wrapIcon(TableIconRaw);
const PageIcon = wrapIcon(PageIconRaw);
const PieChartIcon = wrapIcon(PieChartIconRaw);
const BoxCubeIcon = wrapIcon(BoxCubeIconRaw);
const PlugInIcon = wrapIcon(PlugInIconRaw);
const DocsIcon = wrapIcon(DocsIconRaw);
const MailIcon = wrapIcon(MailIconRaw);
const HorizontaLDots = wrapIcon(HorizontaLDotsRaw);
const ChatIcon = wrapIcon(ChatIconRaw);
const MoreDotIcon = wrapIcon(MoreDotIconRaw);
const BellIcon = wrapIcon(BellIconRaw);

export {
  DownloadIcon,
  BellIcon,
  MoreDotIcon,
  FileIcon,
  GridIcon,
  AudioIcon,
  VideoIcon,
  BoltIcon,
  PlusIcon,
  BoxIcon,
  CloseIcon,
  CheckCircleIcon,
  AlertIcon,
  InfoIcon,
  ErrorIcon,
  ArrowUpIcon,
  FolderIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  GroupIcon,
  BoxIconLine,
  ShootingStarIcon,
  DollarLineIcon,
  TrashBinIcon,
  AngleUpIcon,
  AngleDownIcon,
  PencilIcon,
  CheckLineIcon,
  CloseLineIcon,
  ChevronDownIcon,
  PaperPlaneIcon,
  EnvelopeIcon,
  LockIcon,
  UserIcon,
  CalenderIcon,
  EyeIcon,
  EyeCloseIcon,
  TimeIcon,
  CopyIcon,
  ChevronstartIcon,
  UserCircleIcon,
  ListIcon,
  TableIcon,
  PageIcon,
  TaskIcon,
  PieChartIcon,
  BoxCubeIcon,
  PlugInIcon,
  DocsIcon,
  MailIcon,
  HorizontaLDots,
  ChevronUpIcon,
  ChatIcon,
};
