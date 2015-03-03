/*
 * stan_highlight_rules.js
 *
 * Copyright (C) 2015 by RStudio, Inc.
 *
 * The Initial Developer of the Original Code is Jeffrey Arnold
 * Portions created by the Initial Developer are Copyright (C) 2014
 * the Initial Developer. All Rights Reserved.
 *
 * Unless you have received this program directly from RStudio pursuant
 * to the terms of a commercial license agreement with RStudio, then
 * this program is licensed to you under the terms of version 3 of the
 * GNU Affero General Public License. This program is distributed WITHOUT
 * ANY EXPRESS OR IMPLIED WARRANTY, INCLUDING THOSE OF NON-INFRINGEMENT,
 * MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. Please refer to the
 * AGPL (http://www.gnu.org/licenses/agpl-3.0.txt) for more details.
 *
 */

define("mode/stan_highlight_rules", function(require, exports, module) {
 
var oop = require("ace/lib/oop");
var lang = require("ace/lib/lang");
var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

var StanHighlightRules = function() {

    var variableName = "[a-zA-Z$][a-zA-Z0-9_$]*\\b"

    var keywords = lang.arrayToMap(
	("for|in|while|if|then|else|return"
	 + "|" + "lower|upper" // include range bounds as keywords
	).split("|")
    );

    // technically keywords, differentiate from regular functions
    var keywordFunctions = lang.arrayToMap(
	("print|increment_log_prob|integrate_ode|reject").split("|")
    );

    var storageType = lang.arrayToMap(
	("int|real|vector|simplex|unit_vector|ordered"
	 + "|" + "positive_ordered|row_vector"
	 + "|" + "matrix|cholesky_factor_cov|cholesky_factor_corr"
	 + "|" + "corr_matrix|cov_matrix"
	 + "|" + "void"
	).split("|")
    );

    var variableLanguage = lang.arrayToMap(
	("lp__").split("|")
    );

    this.$rules = {
	"start" : [
	    {
		token : "comment",
		regex : "\\/\\/.*$"
	    }, {
		token : "comment",
		regex : "#.*$"
	    }, {
		token : "comment", // multi line comment
		merge : true,
		regex : "\\/\\*",
		next : "comment"
	    }, {
		token : "keyword.blockid",
		regex : "functions|data|transformed\\s+data|parameters|" +
			 "transformed\\s+parameters|model|generated\\s+quantities"
	    }, {
		token : "string", // single line
		regex : '["][^"]*["]'
	    }, {
		token : "constant.numeric",
		regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
	    }, {
		token : "keyword.operator", // truncation
		regex : "\\bT(?=\\s*\\[)"
	    }, {
		// highlights everything that looks like a function
		token : function(value) {
		    if (keywordFunctions.hasOwnProperty(value)) {
			return "keyword"
		    } else {
			return "support.function"
		    }
		},
		regex : variableName + "(?=\\s*\\()"
	    }, {
		token : function(value) {
		    if (keywords.hasOwnProperty(value)) {
			return "keyword"
		    }
		    else if (storageType.hasOwnProperty(value)) {
			return "storage.type"
		    }
		    else if (variableLanguage.hasOwnProperty(value)) {
			return "variable.language"
		    }
		    else {
			return "text"
		    }
		},
		// token : "keyword",
		regex : variableName + "\\b"
	    }, {
		token : "keyword.operator",
		regex : "<-|~"
	    }, {
		token : "keyword.operator",
		regex : "\\|\\||&&|==|!=|<=?|>=?|\\+|-|\\.?\\*|\\.?/|\\\\|\\^|!|'|%"
	    }, {
		token : "punctuation.operator",
		regex : ":|,|;|="
	    }, {
		token : "paren.lparen",
		regex : "[\\[\\(\\{]"
	    }, {
		token : "paren.rparen",
		regex : "[\\]\\)\\}]"
	    }, {
		token : "text",
		regex : "\\s+"
	    }
	],
	"comment" : [
	    {
		token : "comment", // closing comment
		regex : ".*?\\*\\/",
		next : "start"
	    }, {
		token : "comment", // comment spanning whole line
		merge : true,
		regex : ".+"
	    }
	]
    };
};

oop.inherits(StanHighlightRules, TextHighlightRules);

exports.StanHighlightRules = StanHighlightRules;
});
