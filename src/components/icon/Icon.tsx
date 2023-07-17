import React from 'react';
import {
  Ic_add_outline,
  Ic_arrow_down_2,
  Ic_arrow_left,
  Ic_arrow_left_2,
  Ic_arrow_right_2,
  Ic_attachment,
  Ic_camera,
  Ic_car,
  Ic_close,
  Ic_create,
  Ic_create_outline,
  Ic_currency_exchange,
  Ic_download,
  Ic_edit_outline,
  Ic_expense,
  Ic_gallery,
  Ic_home,
  Ic_income,
  Ic_line_chart_2,
  Ic_logout,
  Ic_new,
  Ic_notification,
  Ic_pie_chart,
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
  Ic_trash,
  Ic_user,
  Ic_wallet_3,
  Ic_warning,
} from '@assets';
import {IconType} from '@types';

type IconProps = {
  type: IconType;
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
};

const Icon = ({type, width = 32, height = 32, ...props}: IconProps) => {
  switch (type) {
    case 'add_outline':
      return <Ic_add_outline width={width} height={height} {...props} />;
    case 'arrow_down_2':
      return <Ic_arrow_down_2 width={width} height={height} {...props} />;
    case 'arrow_left':
      return <Ic_arrow_left width={width} height={height} {...props} />;
    case 'arrow_left_2':
      return <Ic_arrow_left_2 width={width} height={height} {...props} />;
    case 'arrow_right_2':
      return <Ic_arrow_right_2 width={width} height={height} {...props} />;
    case 'attachment':
      return <Ic_attachment width={width} height={height} {...props} />;
    case 'camera':
      return <Ic_camera width={width} height={height} {...props} />;
    case 'car':
      return <Ic_car width={width} height={height} {...props} />;
    case 'close':
      return <Ic_close width={width} height={height} {...props} />;
    case 'create_outline':
      return <Ic_create_outline width={width} height={height} {...props} />;
    case 'create':
      return <Ic_create width={width} height={height} {...props} />;
    case 'currency_exchange':
      return <Ic_currency_exchange width={width} height={height} {...props} />;
    case 'download':
      return <Ic_download width={width} height={height} {...props} />;
    case 'edit_outline':
      return <Ic_edit_outline width={width} height={height} {...props} />;
    case 'expense':
      return <Ic_expense width={width} height={height} {...props} />;
    case 'gallery':
      return <Ic_gallery width={width} height={height} {...props} />;
    case 'home':
      return <Ic_home width={width} height={height} {...props} />;
    case 'income':
      return <Ic_income width={width} height={height} {...props} />;
    case 'line_chart_2':
      return <Ic_line_chart_2 width={width} height={height} {...props} />;
    case 'logout':
      return <Ic_logout width={width} height={height} {...props} />;
    case 'new':
      return <Ic_new width={width} height={height} {...props} />;
    case 'notification':
      return <Ic_notification width={width} height={height} {...props} />;
    case 'pie_chart':
      return <Ic_pie_chart width={width} height={height} {...props} />;
    case 'recurring_bill':
      return <Ic_recurring_bill width={width} height={height} {...props} />;
    case 'restaurant':
      return <Ic_restaurant width={width} height={height} {...props} />;
    case 'salary':
      return <Ic_salary width={width} height={height} {...props} />;
    case 'search':
      return <Ic_search width={width} height={height} {...props} />;
    case 'settings':
      return <Ic_settings width={width} height={height} {...props} />;
    case 'shopping_bag':
      return <Ic_shopping_bag width={width} height={height} {...props} />;
    case 'show_outline':
      return <Ic_show_outline width={width} height={height} {...props} />;
    case 'sort_highest_lowest':
      return <Ic_sort_highest_lowest width={width} height={height} {...props} />;
    case 'sort':
      return <Ic_sort width={width} height={height} {...props} />;
    case 'success':
      return <Ic_success width={width} height={height} {...props} />;
    case 'transaction':
      return <Ic_transaction width={width} height={height} {...props} />;
    case 'trash':
      return <Ic_trash width={width} height={height} {...props} />;
    case 'user':
      return <Ic_user width={width} height={height} {...props} />;
    case 'wallet_3':
      return <Ic_wallet_3 width={width} height={height} {...props} />;
    case 'warning':
      return <Ic_warning width={width} height={height} {...props} />;
  }
};

export default Icon;
