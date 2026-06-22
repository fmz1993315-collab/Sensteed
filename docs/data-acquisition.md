# 岩馆数据获取方案

## Principle

只把小红书、大众点评、公众号等平台作为人工核验线索，不自动抓取、复制或展示平台内容。核心数据库来自官方地图 POI、人工清洗、用户共建和岩馆认领。

## Source Priority

1. 地图开放平台 POI
   - 高德地图地点搜索。
   - 腾讯位置服务地点搜索。
   - 百度地图地点检索。
   - 关键词：攀岩、抱石、攀岩馆、攀岩中心、climbing、bouldering、岩馆。

2. 人工核验
   - 核对是否营业。
   - 核对地址和坐标。
   - 核对类型：纯抱石、抱石+难度、难度为主、综合馆。
   - 核对设施：先锋、顶绳、自动保护、训练区、儿童课、新手友好。
   - 核对营业时间和官方联系方式。

3. 用户共建
   - 用户提交新增岩馆。
   - 用户标记已关门、搬迁、类型错误、营业时间错误。
   - 用户提交后进入审核队列，不直接覆盖主数据。

4. 岩馆认领
   - 岩馆负责人认领后可以更新官方信息。
   - 认领数据应保留变更记录。

5. 社媒和点评线索
   - 可以记录“疑似新开”“疑似关门”“疑似搬迁”。
   - 不复制图片、正文、评论、评分、头像、昵称、用户轨迹。
   - 线索必须经地图、电话、公众号、岩馆官方或用户反馈复核后入库。

## Suggested Data Model

Gym:

- id
- city
- name
- district
- address
- lat
- lng
- status: open, closed, moved, unknown
- type: bouldering_only, bouldering_and_rope, rope_focused, comprehensive
- has_bouldering
- has_difficulty
- has_lead
- has_top_rope
- has_auto_belay
- beginner_friendly
- training_area
- opening_hours
- official_phone
- official_account
- verified_status
- last_verified_at
- confidence_score
- official_claimed

GymIntent:

- id
- gym_id
- date
- user_id_hash
- created_at
- canceled_at

GymReport:

- id
- gym_id
- user_id_hash
- report_type
- note
- status: pending, accepted, rejected
- created_at
- reviewed_at

## Deduplication Rules

- Normalize names by removing spaces, common suffixes, branch punctuation, and casing differences.
- Treat POIs within 150 meters with highly similar names as possible duplicates.
- Treat same phone number or same official account as strong duplicate evidence.
- Keep source records for traceability; merge into one canonical gym record after review.

## Confidence Score

Suggested scoring:

- +30 from two or more map providers.
- +20 from manual verification within 30 days.
- +25 from official gym claim.
- +10 from two or more user confirmations.
- -25 from user closure or relocation report.
- -15 when not verified for more than 90 days.

Use confidence score to decide display labels, not to hide data silently.
