UPDATE mall_products
SET
  original_price = CASE
    WHEN id = 'linuxdo-deu-mail' AND original_price <= price THEN 68
    WHEN id = 'linuxdo-credit-pack' AND original_price <= price THEN 150
    WHEN id = 'linuxdo-service-pass' AND original_price <= price THEN 360
    ELSE original_price
  END,
  image_url = CASE
    WHEN id = 'linuxdo-deu-mail' THEN 'https://img.icons8.com/isometric/512/message-shared.png'
    WHEN id = 'linuxdo-credit-pack' THEN 'https://img.icons8.com/isometric/512/combo-chart.png'
    WHEN id = 'linuxdo-service-pass' THEN 'https://img.icons8.com/isometric/512/approval.png'
    ELSE image_url
  END,
  images_json = CASE
    WHEN id = 'linuxdo-deu-mail' THEN json_array('https://img.icons8.com/isometric/512/message-shared.png')
    WHEN id = 'linuxdo-credit-pack' THEN json_array('https://img.icons8.com/isometric/512/combo-chart.png')
    WHEN id = 'linuxdo-service-pass' THEN json_array('https://img.icons8.com/isometric/512/approval.png')
    ELSE images_json
  END,
  features_json = CASE
    WHEN id = 'linuxdo-deu-mail' THEN json_array('自动锁定卡密', '订单云端留痕', '支持一键复制')
    WHEN id = 'linuxdo-credit-pack' THEN json_array('人工核验', '状态可追踪', '管理员交付')
    WHEN id = 'linuxdo-service-pass' THEN json_array('专属服务', '人工处理', '售后支持')
    ELSE features_json
  END,
  requires_user_info = CASE
    WHEN id IN ('linuxdo-credit-pack', 'linuxdo-service-pass') THEN 1
    ELSE requires_user_info
  END,
  user_info_fields_json = CASE
    WHEN id IN ('linuxdo-credit-pack', 'linuxdo-service-pass') THEN json_array(json_object('name', 'contact', 'label', '接收账号 / 联系方式 / 备注', 'required', json('true')))
    ELSE user_info_fields_json
  END,
  usage_guide = CASE
    WHEN id = 'linuxdo-deu-mail' THEN '下单后等待管理员确认交付。交付完成后可在我的订单中查看卡密凭证。'
    WHEN id = 'linuxdo-credit-pack' THEN '请在订单信息中补充接收账号或备注，管理员处理后会更新交付结果。'
    WHEN id = 'linuxdo-service-pass' THEN '购买后请等待管理员确认，必要时会通过订单备注与你沟通。'
    ELSE usage_guide
  END,
  updated_at = CURRENT_TIMESTAMP
WHERE id IN ('linuxdo-deu-mail', 'linuxdo-credit-pack', 'linuxdo-service-pass');
