# Commit Colosseum 独立参赛版 — 开始这里

已创建一个全新的本地 Git 仓库：`outputs/commit-worldsfair`，独立分支 `worldsfair`，没有继承任何旧远端、密钥、数据库或部署配置。现有 Commit 仅作只读参考；没有修改原件，没有部署或提交到现有项目。

定位：**Commit — Forward Market for Agent Capacity / Agent Capacity Reservation Layer**。中文可解释为“今天约好未来 Agent 服务的容量、价格、时间和交付条件，事后核对履约，再结算或退款”。

## 现在即可运行

在这个新目录中执行：

```sh
npm ci --ignore-scripts
npm run build
npm start
```

打开 **http://127.0.0.1:4317**。当前机器已安装依赖并完成构建，直接运行 `npm start` 即可；如果本地预览仍在运行，无需重复启动。默认模拟模式，不需要钱包、旧项目配置或付费接口。

## 完成情况

| 要求 | 实际交付 |
| --- | --- |
| 信息架构与 UX | 英文首页、预约工作台、订单记录、供应商观察页、开发者说明；移动端布局 |
| 核心代码 | 报价→确认锁容量→托管→窗口内执行→验收→结算/退款，完整可运行 |
| 链上集成 | Solana Devnet + Circle 官方测试 USDC，逐笔预约托管地址，精确存入校验、验收后转账/退款 |
| 独立环境 | 新 Git 历史、4317 端口、`COMMIT_WF_*` 配置、新 `.state/`；禁止主网与旧 RPC |
| README / 架构 | 已写，含状态机、资金规则、信任边界和运行限制 |
| Demo | 默认任务和四种新代码执行记录；成功结算、服务失败、超时、缺引用退款；录制流程 |
| Pitch | 三分钟英文稿、45–55 秒英文稿 |
| 报名文案 | 项目简介、问题、洞察、市场、商业模式、GTM、验证、团队、历史开发披露 |
| Checklist | 含官方截止、视频/仓库要求、真实性与隔离核对 |
| 独立部署准备 | Dockerfile、独立 Compose、新项目部署说明；尚未实际部署 |

## 必须准确理解的边界

1. **完整闭环已在模拟模式中跑通，真实 Devnet 转账仍待资金与实测。** 官方 Devnet 网络和 Circle mint 已通过实时 RPC 核对；公共 SOL 水龙头限流，新 operator 余额为零。不能把“集成代码已完成”写成“真实存入/结算已完成”。
2. **托管与验证由项目方控制。** 当前没有部署自定义 Solana escrow program，不能宣传为去中心化或经过审计的托管协议。
3. **执行是真实运行的新代码，但服务是固定公共语料检索。** 没有接入实时 LLM、外部供应商或第三方付费服务，不冒充商业 Agent 输出。
4. **没有商业 traction。** 按你确认：Hoikin、香港、独立参赛，没有真实客户、收入、外部试点或融资。文案的访谈和试点数字是下一阶段目标。
5. **没有发布、录制成品视频或提交报名。** 脚本、素材和流程已备好，用户账户操作与最终提交仍由你完成。

## 最少剩余步骤

### 1. 充值测试币，完成两条真实 Devnet 回执

按 `docs/devnet.md` 给新 operator 申请测试 SOL，另用一个全新的买方测试钱包申请 SOL 与 Circle Devnet USDC。切换这个新库的 `.env` 为 devnet，跑成功结算和一次无匹配结果的退款，保存同一笔订单的存入和付款/退款回执。新库会等待真实未来窗口，不能在 Devnet 快进时间。

### 2. 发布到新库 / 新演示环境，并录制两段英文视频

本地库和源码包已准备好，可导入一个**新的** GitHub 仓库。不要向 `commit-capacity` 推送。公开源码不是这次交付自动批准的发布行为；也可使用新私有仓库并按赛事指引给评委访问权。新演示站可用全新托管项目生成的域名，不能动现有域名。

视频按 `submission/pitch-3min.md` 和 `docs/demo-runbook.md` 录制，分别控制在官方要求的时长内。录制模拟版本时保留标签；真实 Devnet 录像必须使用新回执。

### 3. 填表、复核并提交

用 `submission/project-application.md` 的英文内容填写，补入新仓库、新视频和新演示链接，披露旧 Commit 开发历史；最后按 `submission/checklist.md` 检查并自行接受规则、提交表单。

官方规则截止为 **2026 年 10 月 13 日 14:59（香港／上海）**；建议 **10 月 11 日**完成。来源：[官方规则](https://colosseum.com/legal/Crypto%20World's%20Fair%20Hackathon%20Rules.pdf)。

## 文件入口

- 产品与交互：`docs/product-ux.md`
- 架构与真实能力边界：`docs/architecture.md`
- 旧资产盘点与来源：`docs/reference-inventory.md`
- Devnet 资金与回执：`docs/devnet.md`
- Demo 录制：`docs/demo-runbook.md`
- 独立部署：`docs/deployment.md`
- 验证结果：`qa/verification.md`
- 英文申请：`submission/project-application.md`
- 最终检查：`submission/checklist.md`

当前版本服务商页面是只读观察，不含开放入驻、保证金、容量转让或上游硬件预留。下一步优先验证一个外部服务商真的接受预约，再决定是否开发这些能力。


## Latest live verification — 5 October 2026
Independent Devnet rehearsal confirmed buyer-signed deposits, provider payout and a separate full no-show refund, each for0.15Circle test USDC. See `evidence/` for checked receipts. Historical funding/setup instructions above are for reproducing with fresh wallets, not an unresolved gap. No market validation is claimed.
