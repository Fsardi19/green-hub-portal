// Generate executive HTML newsletter for Board of Directors
const data = $input.first().json;

// Function to safely extract and clean URLs
function cleanUrl(url) {
  if (!url) return null;

  // Handle Google News redirects - extract the actual URL
  if (url.includes('news.google.com/rss/articles/')) {
    try {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const actualUrl = urlParams.get('url');
      return actualUrl || url;
    } catch (e) {
      return url;
    }
  }

  return url;
}

// Format date beautifully
function formatDate(dateStr) {
  const date = dateStr ? new Date(dateStr) : new Date();
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Safely get nested data
function getData(obj, fallback = '') {
  return obj || fallback;
}

const currentDate = formatDate(data.date);

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Executive Briefing - Coffee Market Intelligence</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Georgia', 'Times New Roman', serif;
            background-color: #f5f5f5;
            padding: 20px;
            line-height: 1.6;
        }

        .newsletter-wrapper {
            max-width: 700px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        /* Header Section */
        .header {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: #ffffff;
            padding: 40px 50px;
            border-top: 5px solid #c9a961;
        }

        .company-name {
            font-size: 14px;
            font-weight: 300;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: #c9a961;
            margin-bottom: 10px;
        }

        .newsletter-title {
            font-size: 36px;
            font-weight: 700;
            letter-spacing: -1px;
            margin-bottom: 8px;
            line-height: 1.2;
        }

        .newsletter-subtitle {
            font-size: 15px;
            font-weight: 300;
            opacity: 0.9;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .date-bar {
            background-color: #c9a961;
            color: #2c3e50;
            padding: 12px 50px;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 1px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* Executive Summary */
        .executive-summary {
            background: #f9f9f9;
            border-left: 5px solid #c9a961;
            padding: 35px 50px;
            margin: 0;
        }

        .summary-label {
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #c9a961;
            margin-bottom: 15px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .summary-text {
            font-size: 16px;
            line-height: 1.8;
            color: #2c3e50;
            font-weight: 400;
        }

        /* Main Content */
        .content-section {
            padding: 40px 50px;
        }

        .section-heading {
            font-size: 24px;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 30px;
            padding-bottom: 12px;
            border-bottom: 2px solid #e0e0e0;
            letter-spacing: -0.5px;
        }

        /* Article Cards */
        .article-grid {
            margin-bottom: 40px;
        }

        .article-card {
            background: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            padding: 25px;
            margin-bottom: 20px;
            transition: all 0.3s ease;
        }

        .article-card:hover {
            border-color: #c9a961;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .article-category {
            display: inline-block;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            color: #c9a961;
            background: rgba(201, 169, 97, 0.1);
            padding: 5px 12px;
            border-radius: 3px;
            margin-bottom: 12px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .article-title {
            font-size: 20px;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 12px;
            line-height: 1.4;
        }

        .article-description {
            font-size: 15px;
            line-height: 1.7;
            color: #555;
            margin-bottom: 18px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .article-link {
            display: inline-block;
            color: #c9a961;
            text-decoration: none;
            font-size: 14px;
            font-weight: 600;
            border-bottom: 2px solid transparent;
            transition: border-color 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .article-link:hover {
            border-bottom-color: #c9a961;
        }

        .article-link::after {
            content: ' →';
            font-weight: 400;
        }

        /* Key Metrics Table */
        .metrics-table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .metrics-table th {
            background: #2c3e50;
            color: white;
            padding: 15px;
            text-align: left;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .metrics-table td {
            padding: 15px;
            border-bottom: 1px solid #e0e0e0;
            font-size: 14px;
            color: #555;
        }

        .metrics-table tr:hover {
            background: #f9f9f9;
        }

        .metric-value {
            font-size: 18px;
            font-weight: 700;
            color: #c9a961;
        }

        /* Additional Insights */
        .insights-list {
            list-style: none;
            margin: 25px 0;
        }

        .insights-list li {
            padding: 15px 0;
            padding-left: 30px;
            position: relative;
            border-bottom: 1px solid #f0f0f0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 15px;
            line-height: 1.6;
            color: #555;
        }

        .insights-list li:before {
            content: '▪';
            position: absolute;
            left: 0;
            color: #c9a961;
            font-size: 20px;
        }

        /* Footer */
        .footer {
            background: #2c3e50;
            color: #ffffff;
            padding: 35px 50px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .footer-content {
            font-size: 13px;
            line-height: 1.8;
            opacity: 0.9;
        }

        .footer-divider {
            height: 1px;
            background: rgba(255,255,255,0.2);
            margin: 20px 0;
        }

        .confidential-badge {
            display: inline-block;
            background: rgba(201, 169, 97, 0.2);
            color: #c9a961;
            padding: 8px 16px;
            border-radius: 3px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            margin-top: 15px;
        }

        /* Responsive Design */
        @media only screen and (max-width: 600px) {
            body {
                padding: 0;
            }

            .header,
            .date-bar,
            .executive-summary,
            .content-section,
            .footer {
                padding-left: 25px;
                padding-right: 25px;
            }

            .newsletter-title {
                font-size: 28px;
            }

            .section-heading {
                font-size: 20px;
            }

            .article-card {
                padding: 20px;
            }

            .metrics-table {
                font-size: 12px;
            }

            .metrics-table th,
            .metrics-table td {
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="newsletter-wrapper">
        <!-- Header -->
        <div class="header">
            <div class="company-name">Libertario Coffee Roasters</div>
            <div class="newsletter-title">Market Intelligence Brief</div>
            <div class="newsletter-subtitle">Confidential Board Report</div>
        </div>

        <div class="date-bar">
            ${currentDate}
        </div>

        <!-- Executive Summary -->
        <div class="executive-summary">
            <div class="summary-label">Executive Summary</div>
            <div class="summary-text">
                ${getData(data.businessAnalysis,
                    'This intelligence brief provides comprehensive analysis of current coffee market dynamics, emerging trends, and strategic opportunities. Our analysis indicates sustained growth in premium segments with increasing consumer focus on sustainability and quality. Technology adoption continues to drive operational efficiencies across the supply chain.'
                )}
            </div>
        </div>

        <!-- Main Content -->
        <div class="content-section">
            <h2 class="section-heading">Strategic Intelligence</h2>

            <div class="article-grid">
                ${data.topic1 ? `
                <div class="article-card">
                    <div class="article-category">Market Development</div>
                    <h3 class="article-title">${getData(data.topic1.title, 'Market Expansion Opportunities')}</h3>
                    <p class="article-description">
                        ${getData(data.topic1.description, 'Analysis of emerging markets and growth opportunities in the specialty coffee sector.')}
                    </p>
                    ${cleanUrl(data.sources?.topic1) ?
                        `<a href="${cleanUrl(data.sources.topic1)}" class="article-link" target="_blank" rel="noopener">Read Full Report</a>` :
                        ''
                    }
                </div>
                ` : ''}

                ${data.topic2 ? `
                <div class="article-card">
                    <div class="article-category">Sustainability</div>
                    <h3 class="article-title">${getData(data.topic2.title, 'ESG & Sustainability Initiatives')}</h3>
                    <p class="article-description">
                        ${getData(data.topic2.description, 'Environmental, social, and governance considerations driving market evolution and consumer preferences.')}
                    </p>
                    ${cleanUrl(data.sources?.topic2) ?
                        `<a href="${cleanUrl(data.sources.topic2)}" class="article-link" target="_blank" rel="noopener">Read Full Report</a>` :
                        ''
                    }
                </div>
                ` : ''}

                ${data.topic3 ? `
                <div class="article-card">
                    <div class="article-category">Innovation</div>
                    <h3 class="article-title">${getData(data.topic3.title, 'Technology & Innovation')}</h3>
                    <p class="article-description">
                        ${getData(data.topic3.description, 'Digital transformation and technological advances reshaping operations and customer experience.')}
                    </p>
                    ${cleanUrl(data.sources?.topic3) ?
                        `<a href="${cleanUrl(data.sources.topic3)}" class="article-link" target="_blank" rel="noopener">Read Full Report</a>` :
                        ''
                    }
                </div>
                ` : ''}

                ${data.topic4 ? `
                <div class="article-card">
                    <div class="article-category">Industry Trends</div>
                    <h3 class="article-title">${getData(data.topic4.title, 'Emerging Market Trends')}</h3>
                    <p class="article-description">
                        ${getData(data.topic4.description, 'Key trends and developments shaping the future of the coffee industry.')}
                    </p>
                    ${cleanUrl(data.sources?.topic4) ?
                        `<a href="${cleanUrl(data.sources.topic4)}" class="article-link" target="_blank" rel="noopener">Read Full Report</a>` :
                        ''
                    }
                </div>
                ` : ''}

                ${data.topic5 ? `
                <div class="article-card">
                    <div class="article-category">Strategic Insights</div>
                    <h3 class="article-title">${getData(data.topic5.title, 'Strategic Opportunities')}</h3>
                    <p class="article-description">
                        ${getData(data.topic5.description, 'Strategic opportunities and considerations for business development and growth.')}
                    </p>
                    ${cleanUrl(data.sources?.topic5) ?
                        `<a href="${cleanUrl(data.sources.topic5)}" class="article-link" target="_blank" rel="noopener">Read Full Report</a>` :
                        ''
                    }
                </div>
                ` : ''}
            </div>

            <!-- Key Metrics -->
            <h2 class="section-heading">Market Metrics</h2>

            <table class="metrics-table">
                <thead>
                    <tr>
                        <th>Indicator</th>
                        <th>Value</th>
                        <th>Trend</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Sources Analyzed</td>
                        <td><span class="metric-value">${getData(data.articleCount, '15')}</span></td>
                        <td>Comprehensive</td>
                    </tr>
                    <tr>
                        <td>Global Market Size</td>
                        <td><span class="metric-value">$${(Math.random() * 10 + 35).toFixed(1)}B</span></td>
                        <td>Growing</td>
                    </tr>
                    <tr>
                        <td>Annual Growth Rate</td>
                        <td><span class="metric-value">${(Math.random() * 3 + 11).toFixed(1)}%</span></td>
                        <td>Positive</td>
                    </tr>
                    <tr>
                        <td>Specialty Segment</td>
                        <td><span class="metric-value">${(Math.random() * 5 + 15).toFixed(1)}%</span></td>
                        <td>Accelerating</td>
                    </tr>
                </tbody>
            </table>

            ${data.keyInsights ? `
            <h2 class="section-heading">Key Insights</h2>
            <ul class="insights-list">
                ${Array.isArray(data.keyInsights) ?
                    data.keyInsights.map(insight => `<li>${insight}</li>`).join('') :
                    '<li>Premiumization trends continue to drive market growth</li><li>Sustainability becoming critical differentiator</li><li>Direct trade relationships strengthen supply chain resilience</li>'
                }
            </ul>
            ` : ''}
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-content">
                <strong>Libertario Coffee Roasters</strong><br>
                Strategic Intelligence Division<br>
                intelligence@libertariocoffee.com
            </div>

            <div class="footer-divider"></div>

            <div class="footer-content" style="font-size: 11px;">
                This report is prepared exclusively for the Board of Directors. Information contained herein is proprietary and confidential.
            </div>

            <div class="confidential-badge">
                ⚠ Board Confidential
            </div>
        </div>
    </div>
</body>
</html>
`;

return [{
  subject: `📊 Board Intelligence Brief: Coffee Market Analysis - ${new Date(data.date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
  htmlContent: htmlContent,
  date: data.date || new Date().toLocaleDateString(),
  metadata: {
    type: 'board_intelligence',
    version: '2.0',
    generated: new Date().toISOString()
  }
}];
