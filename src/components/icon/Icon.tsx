import React from 'react';
import {
  Ic_add_outline,
  Ic_arrow_down_2,
  Ic_arrow_left,
  Ic_arrow_left_2,
  Ic_arrow_right_2,
  Ic_attachment,
  Ic_bank_america,
  Ic_bank_bca,
  Ic_bank_chase,
  Ic_bank_citi,
  Ic_bank_jago,
  Ic_bank_mandiri,
  Ic_camera,
  Ic_car,
  Ic_check,
  Ic_close,
  Ic_create,
  Ic_create_outline,
  Ic_cross,
  Ic_download,
  Ic_edit_outline,
  Ic_expense,
  Ic_file,
  Ic_flash,
  Ic_gallery,
  Ic_home,
  Ic_income,
  Ic_line_chart_2,
  Ic_logout,
  Ic_new,
  Ic_notification,
  Ic_paypal,
  Ic_pie_chart,
  Ic_plus,
  Ic_recurring_bill,
  Ic_restaurant,
  Ic_salary,
  Ic_search,
  Ic_settings,
  Ic_shopping_bag,
  Ic_show_outline,
  Ic_sort,
  Ic_sort_highest_lowest,
  Ic_success,
  Ic_transaction,
  Ic_transfer,
  Ic_transfer_alternate,
  Ic_trash,
  Ic_user,
  Ic_wallet_3,
  Ic_warning,
} from '@assets';
import {theme} from '@themes';
import {IconType} from '@types';

type IconProps = {
  type: IconType;
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
};

const Icon = ({
  type,
  width = 32,
  height = 32,
  fill = theme['black_1'],
  stroke,
  ...props
}: IconProps) => {
  switch (type) {
    case 'add_outline':
      return (
        <Ic_add_outline width={width} height={height} fill={fill} stroke={stroke} {...props} />
      );
    case 'arrow_down_2':
      return (
        <Ic_arrow_down_2 width={width} height={height} fill={fill} stroke={stroke} {...props} />
      );
    case 'arrow_left':
      return <Ic_arrow_left width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'arrow_left_2':
      return (
        <Ic_arrow_left_2 width={width} height={height} fill={fill} stroke={stroke} {...props} />
      );
    case 'arrow_right_2':
      return (
        <Ic_arrow_right_2 width={width} height={height} fill={fill} stroke={stroke} {...props} />
      );
    case 'attachment':
      return <Ic_attachment width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'bank-america':
      return (
        <Ic_bank_america width={width} height={height} fill={fill} stroke={stroke} {...props} />
      );
    case 'bank-bca':
      return <Ic_bank_bca width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'bank-chase':
      return <Ic_bank_chase width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'bank-citi':
      return <Ic_bank_citi width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'bank-jago':
      return <Ic_bank_jago width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'bank-mandiri':
      return (
        <Ic_bank_mandiri width={width} height={height} fill={fill} stroke={stroke} {...props} />
      );
    case 'camera':
      return <Ic_camera width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'car':
      return <Ic_car width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'check':
      return <Ic_check width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'close':
      return <Ic_close width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'create_outline':
      return (
        <Ic_create_outline width={width} height={height} fill={fill} stroke={stroke} {...props} />
      );
    case 'create':
      return <Ic_create width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'cross':
      return <Ic_cross width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'download':
      return <Ic_download width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'edit_outline':
      return (
        <Ic_edit_outline width={width} height={height} fill={fill} stroke={stroke} {...props} />
      );
    case 'expense':
      return <Ic_expense width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'file':
      return <Ic_file width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'flash':
      return <Ic_flash width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'gallery':
      return <Ic_gallery width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'home':
      return <Ic_home width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'income':
      return <Ic_income width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'line_chart_2':
      return (
        <Ic_line_chart_2 width={width} height={height} fill={fill} stroke={stroke} {...props} />
      );
    case 'logout':
      return <Ic_logout width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'new':
      return <Ic_new width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'notification':
      return (
        <Ic_notification width={width} height={height} fill={fill} stroke={stroke} {...props} />
      );
    case 'paypal':
      return <Ic_paypal width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'plus':
      return <Ic_plus width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'pie_chart':
      return <Ic_pie_chart width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'recurring_bill':
      return (
        <Ic_recurring_bill width={width} height={height} fill={fill} stroke={stroke} {...props} />
      );
    case 'restaurant':
      return <Ic_restaurant width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'salary':
      return <Ic_salary width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'search':
      return <Ic_search width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'settings':
      return <Ic_settings width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'shopping_bag':
      return (
        <Ic_shopping_bag width={width} height={height} fill={fill} stroke={stroke} {...props} />
      );
    case 'show_outline':
      return (
        <Ic_show_outline width={width} height={height} fill={fill} stroke={stroke} {...props} />
      );
    case 'sort_highest_lowest':
      return (
        <Ic_sort_highest_lowest
          width={width}
          height={height}
          fill={fill}
          stroke={stroke}
          {...props}
        />
      );
    case 'sort':
      return <Ic_sort width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'success':
      return <Ic_success width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'transaction':
      return (
        <Ic_transaction width={width} height={height} fill={fill} stroke={stroke} {...props} />
      );
    case 'transfer':
      return <Ic_transfer width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'transfer_alternate':
      return <Ic_transfer_alternate width={width} height={height} {...props} />;
    case 'trash':
      return <Ic_trash width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'user':
      return <Ic_user width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'wallet_3':
      return <Ic_wallet_3 width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    case 'warning':
      return <Ic_warning width={width} height={height} fill={fill} stroke={stroke} {...props} />;
    default:
      return (
        <Ic_arrow_down_2 width={width} height={height} fill={fill} stroke={stroke} {...props} />
      );
  }
};

export default Icon;
