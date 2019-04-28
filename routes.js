// Helper for traversing DOM like jQuery
const cheerio = require('cheerio');
// Helper for timestamp comparisons
const moment = require('moment-timezone');
// Helper for HTTP Requests with Promises
const request = require('request-promise');

// Set up Express Router
const router = require('express').Router();

// Application route
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

function now() {
    return moment().tz('Asia/Calcutta').utc();
}

// API route
router.get('/:username/:repository', function(req, res) {
    // Fix the URL for repository issues page
    const URL = `https://github.com/${req.params.username}/${req.params.repository}/issues`;
    // Current page number
    let page = 1;
    
    // Make request for the issues page
    request({
        uri: `${URL}?page=${page}&q=is%3Aissue+is%3Aopen`,
        transform: function (html) {
            return cheerio.load(html);
        }
    }).then(async function($) {
        // Get the total number of open issues from 1st page
        const num = parseInt($('a.js-selected-navigation-item.selected.reponav-item>span.Counter').text().replace(',', ''));

        // Store the issue timestamps in array
        let issues = [];
        $('div.js-navigation-container.js-active-navigation-container>div>div>div.col-9>div.mt-1>span.opened-by>relative-time').filter(function(e) {
            // Filter the datetime attribute from
            // relative-time tag inside each issue
            let dt = $(this).attr('datetime');
            issues.push(dt);
        });

        // Check if pagination panel is present (i.e. there are multiple pages)
        const paginate = $('div.paginate-container').find('div.pagination').length > 0;
        // Check if pagination panel has the `next` button and is enabled 
        let has_next = !$('div.paginate-container>div.pagination>.next_page').hasClass('disabled');

        // Check if last issue on the page is older than a week
        // If so, stop making more requests as we only need to subract the 
        // no. of recent issues from the total to get no. of issues older than a week.
        let old_data = false;
        let dt = moment(issues[issues.length - 1].toString()).tz('Asia/Calcutta').utc();
        if (dt < now().subtract(1, 'weeks')) {
            old_data = true;
        }

        while (paginate && has_next && !old_data) {
            // Increment page number
            page++;
            // Make request for subsequent pages until possible
            await request({
                uri: `${URL}?page=${page}&q=is%3Aissue+is%3Aopen`,
                transform: function(html) {
                    return cheerio.load(html);
                }
            }).then(function($) {
                $('div.js-navigation-container.js-active-navigation-container>div>div>div.col-9>div.mt-1>span.opened-by>relative-time').filter(function(e) {
                    let dt = $(this).attr('datetime');
                    issues.push(dt);
                });
                // Check if pagination panel has the `next` button and is enabled
                has_next = !$('div.paginate-container>div.pagination>.next_page').hasClass('disabled');

                // Check for old data
                let dt = moment(issues[issues.length - 1].toString()).tz('Asia/Calcutta').utc();
                if (dt < now().subtract(1, 'weeks')) {
                    old_data = true;
                }
            }).catch(function(err) {
                // Scraping failed or Cheerio choked
                console.error(err.toString());
                return res.json({
                    error: true,
                    info: err.toString()
                });
            });
        }

        // Compute the number of issues for each category based on their timestamp
        let last_24 = 0, last_week = 0;
        issues.forEach(elem => {
            let dt = moment(elem.toString()).tz('Asia/Calcutta').utc();
            if (dt >= now().subtract(1, 'days')) {
                last_24++;
            } else if (dt >= now().subtract(1, 'weeks')) {
                last_week++;
            }
        });
        const before_last_week = num - (last_24 + last_week);

        // Assert that the sum of issues in all categories equals the total number of issues
        console.assert((last_24 + last_week + before_last_week) == num, "error in computing issues for diff categories!");

        // Return the info in JSON object
        return res.json({
            'error': false,
            'issues': {
                'total': num,
                'last_24': last_24,
                'last_week': last_week,
                'before_last_week': before_last_week
            }
        });
    }).catch(function (err) {
        // Scraping failed or Cheerio choked
        console.error(err.toString());
        return res.json({
            error: true,
            info: err.toString()
        });
    });
});

module.exports = router;