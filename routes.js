const async = require('async');

const request = require('request');
const cheerio = require('cheerio');

// Set up Express Router
const router = require('express').Router();

// main route
router.get('/:username/:repository', (req, res) => {

    var page = 1;
    var url = `https://github.com/${req.params.username}/${req.params.repository}/issues`;

	request(`${url}?page=${page}&q=is%3Aissue+is%3Aopen`, function(err, resp, html) {
		if (err) {
            console.log('error occured while loading the page!');
            return res.json({
                error: true
            });
        }
        var $ = cheerio.load(html);
        var num = $('a.js-selected-navigation-item.selected.reponav-item>span.Counter').text();

        var issues = [];

        $('div.js-navigation-container.js-active-navigation-container>div').each(function(elem) {
            var elem = $(this);
            var issue_id = elem.attr('id').toString().substring(6);
            
            request(`${url}/${issue_id}`, function(err, resp, html) {
                if (err) {
                    console.log('error occured while loading the page!');
                    return res.json({
                        error: true
                    });
                }
                var issue_page = cheerio.load(html);
                const title = issue_page('h1.gh-header-title>span.js-issue-title').text().trim();
                const dt = issue_page('relative-time').first().attr('datetime');
                console.log(title.trim());
                console.log(dt);
                issues.push({
                    'title': title,
                    'datetime': dt
                });
            });
        });
        var paginate = $('.paginate-container').children();

        // while (paginate.length > 0 && page < 3) {
        //     page++;
        //     request(`${url}?page=${page}&q=is%3Aissue+is%3Aopen`, function(err, resp, html) {
        //         if (err) {
        //             console.log('error occured while loading the page!');
        //             return res.json({
        //                 error: true
        //             });
        //         }
        //         $ = cheerio.load(html);
        //         $('div.Box-row.Box-row--focus-gray.p-0.mt-0.js-navigation-item.js-issue-row.selectable.read.navigation-focus').each(elem => {
        //             var elem = $(elem);
        //             const title = elem.children().first().children('div.float-left.col-9.lh-condensed.p-2>a').text();
        //             issues.push(title);
        //         });
        //         paginate = $('.paginate-container').children('span.next_page').hasClass('disabled') || $('.paginate-container').children();
        //         console.log(paginate);
        //     });
        // }
        res.json({
            'error': false,
            'number': num,
            'issues': issues
        });
	});
});

module.exports = router;