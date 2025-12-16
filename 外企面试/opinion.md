# Opinion Trade 页面分析 / Opinion Trade Page Analysis

针对 URL `https://app.opinion.trade/detail?topicId=78&type=multi` 的检查与问题解答。
Inspection and Q&A for the URL `https://app.opinion.trade/detail?topicId=78&type=multi`.

---

## 1. 对于每个子市场，“outcome”（结果）是什么意思？
## 1. What does "outcome" mean for each sub-market?

**CN (中文):**
在 `type=multi`（多选项）的市场中，**Outcome** 指的是该预测话题下可能发生的**具体选项**或**事件分支**。
例如，如果话题是“2024年大选获胜者”，Outcome 可能是具体的候选人名字。
最终**只有一个** Outcome 会被判定为“发生”（获胜结果），其他的 Outcome 都会被判定为“未发生”（失败结果）。

**EN (English):**
In a `type=multi` (multi-outcome) market, **Outcome** refers to the **specific option** or **event branch** that could occur under the prediction topic.
For example, if the topic is "2024 Election Winner," the Outcomes would be the names of specific candidates.
Ultimately, **only one** Outcome will be determined as "occurred" (the Winning Outcome), and all other Outcomes will be determined as "not occurred" (Losing Outcomes).

---

## 2. “% chance”（百分比概率）代表什么，它是如何确定或计算的？
## 2. What does "% chance" represent, and how is it determined or calculated?

**CN (中文):**
*   **含义**：它代表市场当前认为该结果发生的**隐含概率**。
*   **计算方式**：这个百分比直接由该结果的 **“Yes”代币的当前交易价格** 决定。
*   **公式**：`概率 = "Yes"代币价格 / 1.00美元`。
    *   例如：如果“Yes”代币交易价格为 $0.60，则显示的概率为 60%。这反映了市场参与者用资金投票出的集体共识。

**EN (English):**
*   **Meaning**: It represents the **implied probability** that the market currently believes the outcome will occur.
*   **Calculation**: This percentage is determined directly by the **current trading price of the "Yes" token** for that outcome.
*   **Formula**: `Probability = "Yes" Token Price / $1.00`.
    *   Example: If the "Yes" token is trading at $0.60, the displayed probability is 60%. This reflects the collective consensus voted on by market participants with their capital.

---

## 3. “Yes”和“No”代币的价格如何确定？“Bids”（买价）和“Asks”（卖价）有什么区别？
## 3. How are the prices of "Yes" and "No" tokens determined? What is the difference between "Bids" and "Asks"?

**CN (中文):**
*   **价格确定**：价格不是由平台设定的，而是完全由**市场供需关系（订单簿）**决定的。买的人多价格就涨，卖的人多价格就跌。
*   **Bids (买价)**：这是当前**买家**愿意支付的**最高价格**。如果你想立即卖出（Sell）代币，通常会按这个价格成交。
*   **Asks (卖价)**：这是当前**卖家**愿意接受的**最低价格**。如果你想立即买入（Buy）代币，通常会按这个价格成交。

**EN (English):**
*   **Price Determination**: Prices are not set by the platform but are determined entirely by **market supply and demand (order book)**. If more people buy, the price goes up; if more people sell, the price goes down.
*   Bids: This is the highest price a buyer is currently willing to pay. If you want to Sell tokens immediately, you will typically execute at this price.
*   Asks: This is the lowest price a seller is currently willing to accept. If you want to Buy tokens immediately, you will typically execute at this price.

---

## 4. “Yes”和“No”代币的价格范围是多少，为什么要这样设定？
## 4. What is the price range for "Yes" and "No" tokens, and why is it set this way?

**CN (中文):**
*   **价格范围**：**$0.00 到 $1.00**。
*   **设定原因**：这是基于**二元期权（Binary Options）**的结算逻辑：
    *   **如果事件发生（Win）**：每个“Yes”代币最终可兑换 **$1.00**。
    *   **如果事件未发生（Lose）**：每个“Yes”代币最终价值归零，即 **$0.00**。
    *   因此，在结果揭晓前，代币的市场价格必然处于 $0（绝对不可能）和 $1（绝对确定）之间，价格本身即代表了预期的期望价值。

**EN (English):**
*   Price Range: $0.00 to $1.00.
*   Reason: This is based on the settlement logic of Binary Options:
    *   If the event occurs (Win): Each "Yes" token is ultimately redeemable for $1.00.
    *   If the event does not occur (Lose): Each "Yes" token becomes worthless, i.e., $0.00.
    *   Therefore, before the result is known, the market price of the token must necessarily be between $0 (absolutely impossible) and $1 (absolutely certain), and the price itself represents the expected value.
