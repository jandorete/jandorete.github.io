var uniqueIds = [];

function compare(a, b) {
    if (a.title < b.title) {
        return -1;
    }
    if (a.title > b.title) {
        return 1;
    }
    return 0;
}

function populateList(items) {
    var template = document.getElementById('persona_template');
    console.log(items);
    for (var k in items) {
        if (items[k].title.split(" ")[0] !== "List" && items[k].title.split(" ")[0] !== "Persona" && items[k].title.split(" ")[1] !== "Arcana" && items[k].title.split(" ")[2] !== "Arcana") {
            var itemNode = template.cloneNode(true);
            itemNode.setAttribute('id', items[k].id);
            var html = "";

            for (var i = 0; i < items[k].title.length; i++) {
                var span = (i % 2 == 0) ? "even" : "odd";
                html += "<span class='title-" + span + "'>" + items[k].title.charAt(i) + "</span>";
            }

            itemNode.querySelector('#persona_name').innerHTML = html;
            itemNode.querySelector('#persona_name').setAttribute('id', '');
            
            itemNode.querySelector('#persona_link').setAttribute('href', 'https://megamitensei.fandom.com' + items[k].url);
            itemNode.querySelector('#persona_link').setAttribute('title', items[k].title);
            itemNode.querySelector('#persona_link').setAttribute('target', '_blank');
            itemNode.querySelector('#persona_link').setAttribute('id', '');

            if (items[k].thumbnail) {
                itemNode.querySelector('#persona_image').setAttribute('src', items[k].thumbnail.split(".png")[0] + ".png");
                // itemNode.querySelector('#persona_image').setAttribute('src', 'https://via.placeholder.com/999');
                itemNode.querySelector('#persona_image').setAttribute('id', '');
            }
            
            document.getElementById('persona_list').appendChild(itemNode);
        }
    }
}

$.ajax({
    url: 'https://cors-anywhere.herokuapp.com/https://megamitensei.fandom.com/api/v1/Articles/List',
    type: 'GET',
    data: {
        limit: 9999,
        category: 'Persona_3_Personas'
    },
    success: function (data) {
        data.items.forEach(function (item) {
            if ($.inArray(item.id, uniqueIds) === -1) uniqueIds.push(item.id);
        });

        $.ajax({
            url: 'https://cors-anywhere.herokuapp.com/https://megamitensei.fandom.com/api/v1/Articles/List',
            type: 'GET',
            data: {
                limit: 9999,
                category: 'Persona_4_Personas'
            },
            success: function (data) {
                data.items.forEach(function (item) {
                    if ($.inArray(item.id, uniqueIds) === -1) uniqueIds.push(item.id);
                });

                $.ajax({
                    url: 'https://cors-anywhere.herokuapp.com/https://megamitensei.fandom.com/api/v1/Articles/List',
                    type: 'GET',
                    data: {
                        limit: 9999,
                        category: 'Persona_5_Personas'
                    },
                    success: function (data) {
                        data.items.forEach(function (item) {
                            if ($.inArray(item.id, uniqueIds) === -1) uniqueIds.push(item.id);
                        });

                        $.ajax({
                            url: 'https://cors-anywhere.herokuapp.com/https://megamitensei.fandom.com/api/v1/Articles/Details',
                            type: 'GET',
                            data: {
                                ids: uniqueIds.join(),
                                abstract: 250
                            },
                            success: function (data) {
                                var items = Object.values(data.items);
                                items = Array.from(items);
                                items.sort(compare);
                                populateList(items);
                            }
                        });
                    }
                });
            }
        });
    }
});