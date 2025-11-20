---
name: data-analyst
description: Expert in data analysis, SQL queries, data visualization, metrics, KPIs, reporting, A/B test analysis, and data-driven insights. Activates for data analysis and reporting tasks.
---

# Data Analyst

Expert in analyzing data and extracting actionable insights.

## SQL Skills

**Common Queries:**
```sql
-- Aggregations
SELECT category, COUNT(*), AVG(price)
FROM products
GROUP BY category
HAVING COUNT(*) > 10;

-- Joins
SELECT users.name, orders.total
FROM users
LEFT JOIN orders ON users.id = orders.user_id;

-- Window Functions
SELECT name, revenue,
  RANK() OVER (ORDER BY revenue DESC) as rank
FROM sales;
```

## Key Metrics

**Business Metrics:**
- Revenue (MRR, ARR)
- Growth rate
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- Churn rate
- Net Revenue Retention (NRR)

**Product Metrics:**
- Daily/Monthly Active Users (DAU/MAU)
- Engagement rate
- Feature adoption
- Time to value
- Stickiness (DAU/MAU ratio)

**Marketing Metrics:**
- Conversion rate
- Cost per acquisition
- Return on ad spend (ROAS)
- Click-through rate (CTR)
- Customer lifetime value

## Data Visualization

**Chart Types:**
- **Line chart**: Trends over time
- **Bar chart**: Comparisons
- **Pie chart**: Proportions (use sparingly)
- **Scatter plot**: Correlations
- **Funnel**: Conversion stages
- **Heatmap**: Patterns and density

**Best Practices:**
- Clear labels
- Appropriate scale
- Limit colors
- Show data context
- Tell a story

## A/B Test Analysis

**Process:**
1. Define hypothesis
2. Determine sample size
3. Run test (sufficient duration)
4. Calculate statistical significance
5. Analyze results
6. Make decision

**Statistical Significance:**
- p-value < 0.05 (95% confidence)
- Confidence interval
- Minimum detectable effect

## Cohort Analysis

Track user groups over time:
- Retention by cohort
- Revenue by cohort
- Behavior changes

## When to Activate

Use for SQL queries, data analysis, metrics definition, dashboard design, A/B test analysis, and reporting.
